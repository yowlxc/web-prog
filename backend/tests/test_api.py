import json

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.repositories import json_repository

students = [{
            "isu": "111111",
            "fio": "Иван Иванов",
            "group": "P3124",
            "dormNumber": 1,
            "roomNumber": 804,
            "dateInDorm": "2020-01-01",
            "isForeign": False,
            "notes": ""
        },
        {
            "isu": "222222",
            "fio": "Семен Семенов",
            "group": "P7777",
            "dormNumber": 2,
            "roomNumber": 804,
            "dateInDorm": "2020-01-01",
            "isForeign": False,
            "notes": ""
        },
        {
            "isu": "333333",
            "fio": "Данила Данилов",
            "group": "P7777",
            "dormNumber": 2,
            "roomNumber": 805,
            "dateInDorm": "2020-01-01",
            "isForeign": False,
            "notes": ""
        }
        ]

student = {
            "isu": "501606",
            "fio": "Платон Потемкин",
            "group": "P3124",
            "dormNumber": 3,
            "roomNumber": 804,
            "dateInDorm": "2020-01-01",
            "isForeign": False,
            "notes": ""
        }


@pytest.fixture
def client(tmp_path, monkeypatch):
    test_file = tmp_path / "students.json"
    monkeypatch.setattr(json_repository, "DATA_FILE", test_file)
    return TestClient(app)


def test_empty_list(client):
    response = client.get("/api/requests")

    assert response.status_code == 200
    assert response.json() == []

def test_post_student(client):
    response = client.post("/api/requests", json=student)
    
    assert response.status_code == 201
    assert response.json()["isu"] == "501606"
    assert response.json()["fio"] == "Платон Потемкин"
    assert response.json()["group"] == "P3124"
    assert response.json()["dormNumber"] == 3
    assert response.json()["dateInDorm"] == "2020-01-01"
    assert response.json()["isForeign"] == False
    assert response.json()["notes"] == ""

def test_get_list(client):
    client.post("/api/requests", json=student)

    response = client.get("/api/requests")

    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_student(client):
    client.post("/api/requests", json=student)

    response = client.get(f"/api/requests/{student['isu']}")

    assert response.status_code == 200
    assert response.json()["isu"] == "501606"

def test_del_student(client):
    client.post("/api/requests", json=student)

    client.delete(f"/api/requests/{student['isu']}")

    response = client.get("/api/requests")

    assert response.status_code == 200
    assert response.json() == []

def test_patch_student(client):
    client.post("/api/requests", json=student)

    response = client.patch(f"/api/requests/{student['isu']}", json={"isu": "111111", "dormNumber": 7})

    assert response.status_code == 200
    assert response.json()["isu"] == "111111"
    assert response.json()["dormNumber"] == 7

def test_get_filter(client):
    for st in students:
        client.post("/api/requests", json=st)

    response = client.get("/api/requests", params={"group": "P7777", "roomNumber": 804})

    assert response.status_code == 200
    assert response.json() == [{
            "isu": "222222",
            "fio": "Семен Семенов",
            "group": "P7777",
            "dormNumber": 2,
            "roomNumber": 804,
            "dateInDorm": "2020-01-01",
            "isForeign": False,
            "notes": ""
        }]

def test_query_filter(client):
    for st in students:
        client.post("/api/requests", json=st)

    response = client.request(
    "QUERY",
    "/api/requests",
    json={"group": "P7777", "roomNumber": 804, "isForeign": False},
)

    assert response.status_code == 200
    assert response.json() == [{
            "isu": "222222",
            "fio": "Семен Семенов",
            "group": "P7777",
            "dormNumber": 2,
            "roomNumber": 804,
            "dateInDorm": "2020-01-01",
            "isForeign": False,
            "notes": ""
        }]

def test_query_filter_fail(client):
    for st in students:
        client.post("/api/requests", json=st)

    response = client.request(
    "QUERY",
    "/api/requests",
    json={"group": "P7777", "roomNumber": 804},
)

    assert response.status_code == 400

