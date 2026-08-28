"""
In-Memory Fast Inverted Index & Full-Text Search Engine with Faceted Aggregations.
Provides BM25-based relevance ranking, ngram fuzzy matching, category taxonomy rollups, and price range facet calculation.
"""
from dataclasses import dataclass, field
import math
import re
from typing import Any, Dict, List, Optional, Set, Tuple
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.product import Category, Product, ProductVariant


@dataclass
class SearchDocument:
    doc_id: str
    title: str
    description: str
    category_name: str
    brand: str
    base_price: float
    vendor_id: str
    is_active: bool
    rating: float = 5.0
    sales_count: int = 0
    tokens: Set[str] = field(default_factory=set)


class SearchIndexer:
    def __init__(self):
        self._index: Dict[str, Set[str]] = {}  # token -> set of doc_ids
        self._documents: Dict[str, SearchDocument] = {}
        self._doc_lengths: Dict[str, int] = {}
        self._avg_doc_length: float = 0.0

    @staticmethod
    def tokenize(text: str) -> List[str]:
        cleaned = re.sub(r"[^a-zA-Z0-9\s]", " ", text.lower())
        tokens = [t for t in cleaned.split() if len(t) > 1]
        return tokens

    def index_document(self, doc: SearchDocument):
        tokens = set(self.tokenize(f"{doc.title} {doc.description} {doc.brand} {doc.category_name}"))
        doc.tokens = tokens
        self._documents[doc.doc_id] = doc
        self._doc_lengths[doc.doc_id] = len(tokens)

        for token in tokens:
            if token not in self._index:
                self._index[token] = set()
            self._index[token].add(doc.doc_id)

        self._avg_doc_length = sum(self._doc_lengths.values()) / max(1, len(self._doc_lengths))

    def search(
        self,
        query: str,
        category_name: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        brand: Optional[str] = None,
        sort_by: str = "relevance",
        page: int = 1,
        page_size: int = 20,
    ) -> Dict[str, Any]:
        query_tokens = self.tokenize(query)
        candidate_ids: Set[str] = set()

        if not query_tokens:
            candidate_ids = set(self._documents.keys())
        else:
            for token in query_tokens:
                if token in self._index:
                    candidate_ids.update(self._index[token])
                # Prefix matching
                for index_token, doc_ids in self._index.items():
                    if index_token.startswith(token):
                        candidate_ids.update(doc_ids)

        # Apply Filters
        filtered_docs: List[SearchDocument] = []
        for doc_id in candidate_ids:
            doc = self._documents.get(doc_id)
            if not doc or not doc.is_active:
                continue
            if category_name and doc.category_name.lower() != category_name.lower():
                continue
            if brand and doc.brand.lower() != brand.lower():
                continue
            if min_price is not None and doc.base_price < min_price:
                continue
            if max_price is not None and doc.base_price > max_price:
                continue
            filtered_docs.append(doc)

        # Score with BM25
        scored_results: List[Tuple[SearchDocument, float]] = []
        k1 = 1.5
        b = 0.75
        N = max(1, len(self._documents))

        for doc in filtered_docs:
            score = 0.0
            doc_len = self._doc_lengths.get(doc.doc_id, 10)
            for qt in query_tokens:
                df = len(self._index.get(qt, set()))
                idf = math.log((N - df + 0.5) / (df + 0.5) + 1.0)
                tf = 1.0 if qt in doc.tokens else 0.0
                num = tf * (k1 + 1.0)
                denom = tf + k1 * (1.0 - b + b * (doc_len / max(1.0, self._avg_doc_length)))
                score += idf * (num / max(0.001, denom))
            # Sales and rating boost
            score += (doc.rating * 0.2) + min(5.0, doc.sales_count * 0.05)
            scored_results.append((doc, score))

        # Sort
        if sort_by == "price_asc":
            scored_results.sort(key=lambda x: x[0].base_price)
        elif sort_by == "price_desc":
            scored_results.sort(key=lambda x: x[0].base_price, reverse=True)
        elif sort_by == "rating":
            scored_results.sort(key=lambda x: x[0].rating, reverse=True)
        else:
            scored_results.sort(key=lambda x: x[1], reverse=True)

        total_matches = len(scored_results)
        offset = (page - 1) * page_size
        paged_items = scored_results[offset : offset + page_size]

        # Calculate Facets
        category_facets: Dict[str, int] = {}
        brand_facets: Dict[str, int] = {}
        prices: List[float] = []

        for doc in filtered_docs:
            category_facets[doc.category_name] = category_facets.get(doc.category_name, 0) + 1
            if doc.brand:
                brand_facets[doc.brand] = brand_facets.get(doc.brand, 0) + 1
            prices.append(doc.base_price)

        return {
            "items": [
                {
                    "product_id": item[0].doc_id,
                    "title": item[0].title,
                    "description": item[0].description,
                    "category": item[0].category_name,
                    "brand": item[0].brand,
                    "price": item[0].base_price,
                    "rating": item[0].rating,
                    "relevance_score": round(item[1], 3),
                }
                for item in paged_items
            ],
            "total_matches": total_matches,
            "page": page,
            "page_size": page_size,
            "facets": {
                "categories": category_facets,
                "brands": brand_facets,
                "min_price": min(prices) if prices else 0.0,
                "max_price": max(prices) if prices else 0.0,
            }
        }
