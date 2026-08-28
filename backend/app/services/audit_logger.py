"""
Immutable Cryptographic Compliance Audit Trail Service.
Constructs verifiable SHA-256 tamper-evident log records of all platform operations and security state modifications.
"""
from datetime import datetime, timezone
import hashlib
import json
import logging
from typing import Any, Dict, List, Optional
import uuid

logger = logging.getLogger("marketsphere.audit")


class AuditLogger:
    _previous_hash: str = "0000000000000000000000000000000000000000000000000000000000000000"

    @classmethod
    def log_event(
        cls,
        actor_id: str,
        actor_role: str,
        action: str,
        resource_type: str,
        resource_id: str,
        payload: Dict[str, Any],
        severity: str = "INFO",
        ip_address: str = "127.0.0.1",
    ) -> Dict[str, Any]:
        timestamp = datetime.now(timezone.utc).isoformat()
        entry_id = str(uuid.uuid4())

        record_content = {
            "id": entry_id,
            "timestamp": timestamp,
            "previous_hash": cls._previous_hash,
            "actor_id": actor_id,
            "actor_role": actor_role,
            "action": action,
            "resource_type": resource_type,
            "resource_id": resource_id,
            "payload": payload,
            "severity": severity,
            "ip_address": ip_address,
        }

        # Calculate cryptographic hash chain
        serialized = json.dumps(record_content, sort_keys=True, default=str)
        record_hash = hashlib.sha256(serialized.encode("utf-8")).hexdigest()
        record_content["entry_hash"] = record_hash
        cls._previous_hash = record_hash

        logger.info(f"[AuditChain] {severity} - {action} on {resource_type}:{resource_id} by {actor_id} (Hash: {record_hash[:12]})")
        return record_content
