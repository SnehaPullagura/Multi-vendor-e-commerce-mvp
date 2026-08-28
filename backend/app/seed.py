import asyncio
import json
from app.common.enums import AddressType, ProductStatus, UserRole, VendorStatus
from app.core.database import AsyncSessionLocal, init_db
from app.core.security import get_password_hash
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
        print("[*] Seeding Users & Sellers...")

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
            description="Premium flagship audio equipment, noise-cancelling headphones, and smart home studio gear.",
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

        # 3. Fashion & Home Seller (Nordic Living & Apparel)
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
            description="Minimalist Scandinavian furniture, organic textiles, ergonomic desks, and artisanal decor.",
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

        # 4. Pending Seller (EcoGoods Organics)
        pending_user = User(
            email="seller.eco@example.com",
            password_hash=get_password_hash("SellerEco123!"),
            full_name="Sarah Green",
            phone="+1-555-0103",
            role=UserRole.SELLER,
            is_active=True,
            is_verified=False,
        )
        db.add(pending_user)
        await db.flush()

        pending_vendor = Vendor(
            user_id=pending_user.id,
            store_name="EcoGoods Organics",
            slug="ecogoods-organics",
            description="Sustainable bamboo home essentials and zero-waste kitchen products.",
            business_email="support@ecogoods.com",
            phone="+1-555-0103",
            tax_id="US-TAX-339182",
            status=VendorStatus.PENDING_REVIEW,
            commission_rate=10.0,
        )
        db.add(pending_vendor)

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
            recipient_name="Teddy Vance",
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

        print("[*] Seeding Categories...")
        # Categories
        cat_electronics = Category(name="Electronics", slug="electronics", display_order=1)
        cat_fashion = Category(name="Fashion & Apparel", slug="fashion", display_order=2)
        cat_home = Category(name="Home & Living", slug="home-living", display_order=3)
        db.add_all([cat_electronics, cat_fashion, cat_home])
        await db.flush()

        # Subcategories
        sub_audio = Category(name="Headphones & Audio", slug="audio", parent_id=cat_electronics.id, display_order=1)
        sub_phones = Category(name="Smartphones & Tablets", slug="smartphones", parent_id=cat_electronics.id, display_order=2)
        sub_mens = Category(name="Men's Clothing", slug="mens-clothing", parent_id=cat_fashion.id, display_order=1)
        sub_womens = Category(name="Women's Footwear", slug="womens-footwear", parent_id=cat_fashion.id, display_order=2)
        db.add_all([sub_audio, sub_phones, sub_mens, sub_womens])
        await db.flush()

        print("[*] Seeding Products with Variant Matrix...")

        # Product 1: Wireless Noise-Cancelling Headphones (TechHub)
        p1 = Product(
            vendor_id=tech_vendor.id,
            category_id=sub_audio.id,
            title="AeroSound Pro Wireless ANC Headphones",
            slug="aerosound-pro-wireless-anc-headphones",
            description="Experience pristine spatial acoustics with active noise cancellation up to 42dB. 40 hours of playtime on a single charge with ultra-comfortable memory foam earcups.",
            brand="AeroSound",
            base_price=249.99,
            status=ProductStatus.PUBLISHED,
            is_featured=True,
        )
        db.add(p1)
        await db.flush()

        v1_black = ProductVariant(
            product_id=p1.id,
            sku="AERO-PRO-BLK",
            title="Midnight Black",
            price=249.99,
            stock_quantity=45,
            attributes_json=json.dumps({"color": "Midnight Black"}),
            is_active=True,
        )
        v1_silver = ProductVariant(
            product_id=p1.id,
            sku="AERO-PRO-SLV",
            title="Lunar Silver",
            price=259.99,
            stock_quantity=30,
            attributes_json=json.dumps({"color": "Lunar Silver"}),
            is_active=True,
        )
        db.add_all([v1_black, v1_silver])
        await db.flush()

        db.add(ProductImage(product_id=p1.id, variant_id=v1_black.id, image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800", is_primary=True, display_order=1))
        db.add(ProductImage(product_id=p1.id, variant_id=v1_silver.id, image_url="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800", is_primary=False, display_order=2))

        # Product 2: Flagship Smartphone 5G (TechHub)
        p2 = Product(
            vendor_id=tech_vendor.id,
            category_id=sub_phones.id,
            title="Nova Titan 5G Smartphone (256GB)",
            slug="nova-titan-5g-smartphone",
            description="Ultra-vibrant 6.7-inch OLED 120Hz display, 108MP quad camera system with AI night photography, and blazing fast 5nm processor.",
            brand="Nova",
            base_price=799.99,
            status=ProductStatus.PUBLISHED,
            is_featured=True,
        )
        db.add(p2)
        await db.flush()

        v2_graphite = ProductVariant(
            product_id=p2.id,
            sku="NOVA-TITAN-GRP",
            title="Graphite Grey / 256GB",
            price=799.99,
            stock_quantity=20,
            attributes_json=json.dumps({"color": "Graphite Grey", "storage": "256GB"}),
            is_active=True,
        )
        db.add(v2_graphite)
        await db.flush()
        db.add(ProductImage(product_id=p2.id, variant_id=v2_graphite.id, image_url="https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800", is_primary=True, display_order=1))

        # Product 3: Heavyweight Organic Cotton Hoodie (UrbanStyle)
        p3 = Product(
            vendor_id=fashion_vendor.id,
            category_id=sub_mens.id,
            title="UrbanStyle Heavyweight Organic Fleece Hoodie",
            slug="urbanstyle-heavyweight-organic-hoodie",
            description="Crafted from 100% GOTS-certified heavyweight organic cotton fleece. Features double-lined hood, reinforced kangaroo pocket, and tailored relaxed fit.",
            brand="UrbanStyle",
            base_price=89.00,
            status=ProductStatus.PUBLISHED,
            is_featured=True,
        )
        db.add(p3)
        await db.flush()

        v3_m_black = ProductVariant(product_id=p3.id, sku="HOOD-ORG-BLK-M", title="Onyx Black / Medium", price=89.00, stock_quantity=25, attributes_json=json.dumps({"color": "Onyx Black", "size": "M"}), is_active=True)
        v3_l_black = ProductVariant(product_id=p3.id, sku="HOOD-ORG-BLK-L", title="Onyx Black / Large", price=89.00, stock_quantity=30, attributes_json=json.dumps({"color": "Onyx Black", "size": "L"}), is_active=True)
        v3_l_sage = ProductVariant(product_id=p3.id, sku="HOOD-ORG-SGE-L", title="Sage Green / Large", price=94.00, stock_quantity=15, attributes_json=json.dumps({"color": "Sage Green", "size": "L"}), is_active=True)
        db.add_all([v3_m_black, v3_l_black, v3_l_sage])
        await db.flush()

        db.add(ProductImage(product_id=p3.id, image_url="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800", is_primary=True, display_order=1))
        db.add(ProductImage(product_id=p3.id, image_url="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800", is_primary=False, display_order=2))

        # Product 4: Minimalist Leather Sneakers (UrbanStyle)
        p4 = Product(
            vendor_id=fashion_vendor.id,
            category_id=sub_womens.id,
            title="Signature Minimalist White Leather Sneakers",
            slug="signature-minimalist-white-leather-sneakers",
            description="Handcrafted Italian full-grain nappa leather sneakers with vulcanized rubber sole and cushioned arch support.",
            brand="UrbanStyle",
            base_price=135.00,
            status=ProductStatus.PUBLISHED,
            is_featured=False,
        )
        db.add(p4)
        await db.flush()

        v4_38 = ProductVariant(product_id=p4.id, sku="SNK-WHT-EU38", title="EU 38 / US 7.5", price=135.00, stock_quantity=18, attributes_json=json.dumps({"size": "EU 38"}), is_active=True)
        v4_39 = ProductVariant(product_id=p4.id, sku="SNK-WHT-EU39", title="EU 39 / US 8.5", price=135.00, stock_quantity=22, attributes_json=json.dumps({"size": "EU 39"}), is_active=True)
        db.add_all([v4_38, v4_39])
        await db.flush()

        db.add(ProductImage(product_id=p4.id, image_url="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800", is_primary=True, display_order=1))

        await db.commit()
        print("[+] Demo database seed complete!")


if __name__ == "__main__":
    asyncio.run(seed_data())
