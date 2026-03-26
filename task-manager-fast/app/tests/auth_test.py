import pytest
import uuid
from httpx import AsyncClient, ASGITransport
from app.main import app
 
# 🔹 Helper to generate unique emails
def get_unique_email():
    return f"test_{uuid.uuid4()}@example.com"


# ✅ 1. Register Success
@pytest.mark.asyncio
async def test_register_success():
    transport = ASGITransport(app=app )

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/auth/register",
            json={
                "name": "karan rawat",
                "email": get_unique_email(),
                "password": "Test@1234"
            }
        )

        print(response.json())
        assert response.status_code in [200, 201]






# ✅ 2. Register Duplicate Email
@pytest.mark.asyncio
async def test_register_duplicate_email():
    transport = ASGITransport(app=app )

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        email = get_unique_email()
        data = {
               "name": "karan rawa  t",
                "email": email,
                "password": "Test@1234"
            }
        print("))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))")

        # First registration
        res  = await client.post(
            "/auth/register",
            json=data
        )

        # Duplicate registration
        response = await client.post(
            "/auth/register",
            json=data
        )

        print("))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))",response )
        assert response.status_code in [400, 409]


# ✅ 3. Login Success
@pytest.mark.asyncio
async def test_login_success():
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        email = get_unique_email()

        # Register first
        await client.post(
            "/auth/register",
            json={
                "name": "karan rawat",
                "email": email,
                "password": "Test@1234"
            }
        )

        # Login
        response = await client.post(
            "/auth/login",
            json={
                "email": email,
                "password": "Test@1234"
            }
        )

        print(response.json())
        assert response.status_code == 200


# ✅ 4. Login Invalid Credentials
@pytest.mark.asyncio
async def test_login_invalid_credentials():
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/auth/login",
            json={
                "email": "wrong@example.com",
                "password": "wrongpassword"
            }
        )

        print(response.json())
        assert response.status_code in [400, 401]


# ✅ 5. Get Current User (/me)
@pytest.mark.asyncio
async def test_me_route():
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        email = get_unique_email()

        # Register
        await client.post(
            "/auth/register",
            json={
                "name": "karan rawat",
                "email": email,
                "password": "Test@1234"
            }
        )

        # Login (this sets cookies automatically)
        login = await client.post(
            "/auth/login",
            json={
                "email": email,
                "password": "Test@1234"
            }
        )

        # 🔍 Debug (optional)
        print("Cookies after login:", client.cookies)

        # Call /me WITHOUT headers or cookies
        response = await client.get("/auth/me")

        print(response.json())
        assert response.status_code == 200

# ✅ 6. Unauthorized /me
@pytest.mark.asyncio
async def test_me_unauthorized():
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/auth/me")

        assert response.status_code in [401, 403]


# ✅ 7. Logout
@pytest.mark.asyncio
async def test_logout():
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        email = get_unique_email()

        # Register
        await client.post(
            "/auth/register",
            json={
                "name": "karan rawat",
                "email": email,
                "password": "Test@1234"
            }
        )

        # Login
        login = await client.post(
            "/auth/login",
            json={
                "email": email,
                "password": "Test@1234"
            }
        )

        # Logout
        response = await client.get(
            "/auth/logout"
        )

        print(response.json())
        assert response.status_code in [200, 204]