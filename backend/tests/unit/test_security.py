from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_password_hash,
    verify_password,
)


def test_password_hashing_and_verification():
    raw_password = "SuperSecretPassword123!"
    hashed = get_password_hash(raw_password)

    assert hashed != raw_password
    assert verify_password(raw_password, hashed) is True
    assert verify_password("WrongPassword!", hashed) is False


def test_jwt_access_and_refresh_tokens():
    user_id = "test-user-uuid-1234"
    claims = {"role": "SELLER", "email": "seller@test.com"}

    access_token = create_access_token(user_id, claims)
    refresh_token = create_refresh_token(user_id)

    decoded_access = decode_token(access_token)
    assert decoded_access is not None
    assert decoded_access["sub"] == user_id
    assert decoded_access["type"] == "access"
    assert decoded_access["role"] == "SELLER"
    assert decoded_access["email"] == "seller@test.com"

    decoded_refresh = decode_token(refresh_token)
    assert decoded_refresh is not None
    assert decoded_refresh["sub"] == user_id
    assert decoded_refresh["type"] == "refresh"


def test_invalid_token_returns_none():
    assert decode_token("invalid.jwt.token") is None
