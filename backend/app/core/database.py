import motor.motor_asyncio
from app.core.config import settings

client: motor.motor_asyncio.AsyncIOMotorClient = None
db: motor.motor_asyncio.AsyncIOMotorDatabase = None


async def connect_db():
    """Create MongoDB connection on startup."""
    global client, db
    client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.MONGODB_DB_NAME]
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.health_records.create_index("user_id")
    print(f"✅ Connected to MongoDB: {settings.MONGODB_DB_NAME}")


async def close_db():
    """Close MongoDB connection on shutdown."""
    global client
    if client:
        client.close()
        print("🔌 MongoDB connection closed.")


def get_db() -> motor.motor_asyncio.AsyncIOMotorDatabase:
    return db
