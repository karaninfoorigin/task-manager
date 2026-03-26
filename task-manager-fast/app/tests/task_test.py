import pytest
import uuid
from httpx import AsyncClient, ASGITransport
from app.main import app


def get_unique_email():
    return f"test_{uuid.uuid4()}@example.com"


@pytest.mark.asyncio
async def test_create_task_success():
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        email = get_unique_email()

        # 🔹 Register
        await client.post(
            "/auth/register",
            json={
                "name": "karan",
                "email": email,
                "password": "Test@1234"
            }
        )

        # 🔹 Login (important for cookies)
        login_res = await client.post(
            "/auth/login",
            json={
                "email": email,
                "password": "Test@1234"
            }
        )

        assert login_res.status_code == 200

        # 🔹 Create Task
        response = await client.post(
            "/user/createTask",
            json={
                "title": "Test Task",
                "description": "This is a test task description",
                "status": "open"
            }
        )

        print(response.json())

        assert response.status_code == 201
        assert response.json()["title"] == "Test Task"


# ✅ Get All Tasks
@pytest.mark.asyncio
async def test_get_all_tasks():
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        email = get_unique_email()

        # Register
        await client.post(
            "/auth/register",
            json={
                "name": "karan",
                "email": email,
                "password": "Test@1234"
            }
        )

        # Login
        await client.post(
            "/auth/login",
            json={
                "email": email,
                "password": "Test@1234"
            }
        )

        # Create Task
        await client.post(
            "/user/createTask",
            json={
                "title": "Task 1",
                "description": "Description 1 for testing",
                "status": "pending"
            }
        )

        # Get Tasks
        response = await client.get("/user/getAllTask")

        print(response.json())

        assert response.status_code == 200
        assert isinstance(response.json(), list)


# ✅ Update Task
@pytest.mark.asyncio
async def test_update_task():
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        email = get_unique_email()

        # Register
        await client.post(
            "/auth/register",
            json={
                "name": "karan",
                "email": email,
                "password": "Test@1234"
            }
        )

        # Login
        await client.post(
            "/auth/login",
            json={
                "email": email,
                "password": "Test@1234"
            }
        )

        # Create Task
        create_res = await client.post(
            "/user/createTask",
            json={
                "title": "Task before update",
                "description": "Some description here",
                "status": "open"
            }
        )

        task_id = create_res.json()["id"]

        # Update Task
        update_res = await client.put(
            f"/user/updateTask/{task_id}",
            json={
                "title": "Updated Task Title"
            }
        )

        print(update_res.json())

        assert update_res.status_code == 200
        assert update_res.json()["title"] == "Updated Task Title"