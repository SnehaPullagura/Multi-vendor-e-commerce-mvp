import asyncio
import json
from app.common.enums import AddressType, ProductStatus, UserRole, VendorStatus
from app.core.database import AsyncSessionLocal, init_db
from app.core.security import get_password_hash
from app.fixtures.catalog_master_categories import CATEGORIES
from app.models.address import Address
from app.models.category import Category
from app.models.image import ProductImage
from app.models.product import Product
from app.models.user import User
from app.models.variant import ProductVariant
from app.models.vendor import Vendor


async def seed_data():
    print("[*] Rebuilding database schema from scratch...")
    from app.core.database import engine, Base
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        print("[*] Seeding Platform Administrators, Vendors & Customers...")

        # 1. Super Admin (Marketsphere Admin)
        admin_user = User(
            email="admin@marketsphere.com",
            password_hash=get_password_hash("SuperAdminPass123!"),
            full_name="Platform Super Admin",
            phone="+1-555-0100",
            role=UserRole.SUPER_ADMIN,
            is_active=True,
            is_verified=True,
        )
        db.add(admin_user)

        # 2. Tech Seller (Apex Audio & Smart Tech)
        tech_user = User(
            email="seller.apex@example.com",
            password_hash=get_password_hash("SellerApex123!"),
            full_name="Marcus Sterling",
            phone="+1-555-0101",
            role=UserRole.SELLER,
            is_active=True,
            is_verified=True,
        )
        db.add(tech_user)
        await db.flush()

        tech_vendor = Vendor(
            user_id=tech_user.id,
            store_name="Apex Audio & Tech",
            slug="apex-audio-tech",
            description="Flagship audiophile hardware, studio gear, high-performance computing peripherals, and sports tech.",
            logo_url="https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=300",
            banner_url="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200",
            business_email="contact@apexaudio.com",
            phone="+1-555-0101",
            tax_id="US-TAX-982341",
            bank_account_details="Bank: Chase, Routing: 021000021, Account: ****4921",
            status=VendorStatus.APPROVED,
            commission_rate=8.5,
            rating=4.9,
        )
        db.add(tech_vendor)

        # 3. Fashion & Home Seller (Nordic Living & Studio)
        fashion_user = User(
            email="seller.nordic@example.com",
            password_hash=get_password_hash("SellerNordic123!"),
            full_name="Astrid Lindholm",
            phone="+1-555-0102",
            role=UserRole.SELLER,
            is_active=True,
            is_verified=True,
        )
        db.add(fashion_user)
        await db.flush()

        fashion_vendor = Vendor(
            user_id=fashion_user.id,
            store_name="Nordic Living & Studio",
            slug="nordic-living-studio",
            description="Scandinavian minimalist furniture, luxury tailored apparel, organic textiles, and artisanal kitchenware.",
            logo_url="https://images.unsplash.com/photo-1544441893-675973e31985?w=300",
            banner_url="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
            business_email="orders@nordicliving.com",
            phone="+1-555-0102",
            tax_id="US-TAX-772910",
            bank_account_details="Bank: Wells Fargo, Routing: 12100024, Account: ****8812",
            status=VendorStatus.APPROVED,
            commission_rate=12.0,
            rating=4.8,
        )
        db.add(fashion_vendor)

        # 4. Organic & Wellness Seller (EcoGoods Organics)
        eco_user = User(
            email="seller.eco@example.com",
            password_hash=get_password_hash("SellerEco123!"),
            full_name="Sarah Green",
            phone="+1-555-0103",
            role=UserRole.SELLER,
            is_active=True,
            is_verified=True,
        )
        db.add(eco_user)
        await db.flush()

        eco_vendor = Vendor(
            user_id=eco_user.id,
            store_name="EcoGoods Organics",
            slug="ecogoods-organics",
            description="Sustainable clean beauty, botanical skincare formulas, zero-waste essentials, and gourmet artisanal provisions.",
            logo_url="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300",
            banner_url="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200",
            business_email="support@ecogoods.com",
            phone="+1-555-0103",
            tax_id="US-TAX-339182",
            bank_account_details="Bank: Citibank, Routing: 021000089, Account: ****1245",
            status=VendorStatus.APPROVED,
            commission_rate=10.0,
            rating=4.9,
        )
        db.add(eco_vendor)

        # 5. Customer (Buyer)
        customer_user = User(
            email="customer@example.com",
            password_hash=get_password_hash("Customer123!"),
            full_name="Alice Johnson",
            phone="+1-555-0200",
            role=UserRole.CUSTOMER,
            is_active=True,
            is_verified=True,
        )
        db.add(customer_user)
        await db.flush()

        # Customer Address
        customer_addr = Address(
            user_id=customer_user.id,
            recipient_name="Alice Johnson",
            phone="+1-555-0199",
            street_address="742 Evergreen Terrace",
            unit="Apt 4B",
            city="San Francisco",
            state="CA",
            postal_code="94107",
            country="United States",
            address_type=AddressType.BOTH,
            is_default=True,
        )
        db.add(customer_addr)
        await db.flush()

        vendor_map = {
            "apex-audio-tech": tech_vendor,
            "nordic-living-studio": fashion_vendor,
            "ecogoods-organics": eco_vendor,
        }

        print("[*] Seeding 6 Core Categories & Subcategories...")
        total_seeded_products = 0
        total_seeded_variants = 0

        for cat_data in CATEGORIES:
            main_cat = Category(
                name=cat_data["name"],
                slug=cat_data["slug"],
                description=cat_data.get("description"),
                display_order=cat_data.get("display_order", 0),
                is_active=True,
            )
            db.add(main_cat)
            await db.flush()

            subcat_lookup = {}
            for sub_data in cat_data.get("subcategories", []):
                subcat = Category(
                    name=sub_data["name"],
                    slug=sub_data["slug"],
                    parent_id=main_cat.id,
                    display_order=sub_data.get("display_order", 0),
                    is_active=True,
                )
                db.add(subcat)
                await db.flush()
                subcat_lookup[sub_data["slug"]] = subcat

            subcats_list = list(subcat_lookup.values())
            vendor = vendor_map.get(cat_data.get("vendor_slug"), tech_vendor)

            print(f"  -> Seeding {len(cat_data['products'])} products for '{cat_data['name']}'...")
            for p_idx, p_data in enumerate(cat_data["products"]):
                # Distribute products across subcategories
                assigned_cat_id = subcats_list[p_idx % len(subcats_list)].id if subcats_list else main_cat.id

                prod = Product(
                    vendor_id=vendor.id,
                    category_id=assigned_cat_id,
                    title=p_data["title"],
                    slug=p_data["slug"],
                    description=p_data["description"],
                    brand=p_data.get("brand"),
                    base_price=p_data["base_price"],
                    status=ProductStatus.PUBLISHED,
                    is_featured=p_data.get("is_featured", False),
                    meta_title=p_data["title"],
                    meta_description=p_data["description"][:160],
                )
                db.add(prod)
                await db.flush()
                total_seeded_products += 1

                for idx, v_data in enumerate(p_data["variants"]):
                    v = ProductVariant(
                        product_id=prod.id,
                        sku=v_data["sku"],
                        title=v_data["title"],
                        price=v_data["price"],
                        cost_price=round(v_data["price"] * 0.65, 2),
                        stock_quantity=v_data.get("stock_quantity", 50),
                        low_stock_threshold=5,
                        attributes_json=json.dumps(v_data.get("attributes", {})),
                        is_active=True,
                    )
                    db.add(v)
                    await db.flush()
                    total_seeded_variants += 1

                    # Add image associated with variant / product
                    if idx == 0 and p_data.get("image_url"):
                        img = ProductImage(
                            product_id=prod.id,
                            variant_id=v.id,
                            image_url=p_data["image_url"],
                            is_primary=True,
                            display_order=1,
                        )
                        db.add(img)

        await db.commit()
        print(f"[+] Successfully seeded {total_seeded_products} products and {total_seeded_variants} variants across 6 categories (35 products/category)!")


if __name__ == "__main__":
    asyncio.run(seed_data())
