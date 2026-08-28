"""
Enterprise Workflow State Machine Engine for Multi-Vendor Platform Operations.
Orchestrates multi-step, transactional lifecycle transitions for Orders, RMAs, Vendor Verifications, and Disputes.
"""
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Callable, Dict, List, Optional, Set, Tuple
import asyncio
import logging
import uuid

logger = logging.getLogger("marketsphere.workflow")


class WorkflowStatus(str, Enum):
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    ROLLED_BACK = "ROLLED_BACK"
    SUSPENDED = "SUSPENDED"


class WorkflowDomain(str, Enum):
    ORDER_FULFILLMENT = "ORDER_FULFILLMENT"
    VENDOR_ONBOARDING = "VENDOR_ONBOARDING"
    RMA_PROCESSING = "RMA_PROCESSING"
    DISPUTE_MEDIATION = "DISPUTE_MEDIATION"
    PAYOUT_SETTLEMENT = "PAYOUT_SETTLEMENT"
    INVENTORY_REALLOCATION = "INVENTORY_REALLOCATION"


@dataclass
class WorkflowTransition:
    from_state: str
    to_state: str
    action_name: str
    required_role: str
    guard_condition: Optional[Callable[[Dict[str, Any]], bool]] = None
    side_effects: List[Callable[[Dict[str, Any]], None]] = field(default_factory=list)
    description: str = ""


class WorkflowDefinition:
    def __init__(self, domain: WorkflowDomain, initial_state: str):
        self.domain = domain
        self.initial_state = initial_state
        self.states: Set[str] = {initial_state}
        self.transitions: Dict[Tuple[str, str], WorkflowTransition] = {}
        self.terminal_states: Set[str] = set()

    def add_state(self, state: str, is_terminal: bool = False):
        self.states.add(state)
        if is_terminal:
            self.terminal_states.add(state)
        return self

    def add_transition(
        self,
        from_state: str,
        to_state: str,
        action: str,
        role: str,
        guard: Optional[Callable[[Dict[str, Any]], bool]] = None,
        side_effects: Optional[List[Callable[[Dict[str, Any]], None]]] = None,
        description: str = "",
        is_terminal: bool = False,
    ):
        self.add_state(from_state)
        self.add_state(to_state, is_terminal=is_terminal)
        t = WorkflowTransition(
            from_state=from_state,
            to_state=to_state,
            action_name=action,
            required_role=role,
            guard_condition=guard,
            side_effects=side_effects or [],
            description=description,
        )
        self.transitions[(from_state, action)] = t
        return self

    def get_transition(self, current_state: str, action: str) -> Optional[WorkflowTransition]:
        return self.transitions.get((current_state, action))


class WorkflowEngine:
    _definitions: Dict[WorkflowDomain, WorkflowDefinition] = {}

    @classmethod
    def register_workflow(cls, workflow_def: WorkflowDefinition):
        cls._definitions[workflow_def.domain] = workflow_def
        logger.info(f"Registered workflow definition for {workflow_def.domain.value}")

    @classmethod
    def get_workflow(cls, domain: WorkflowDomain) -> Optional[WorkflowDefinition]:
        return cls._definitions.get(domain)

    @classmethod
    def initialize_default_workflows(cls):
        # 1. Order Fulfillment Workflow
        order_wf = WorkflowDefinition(WorkflowDomain.ORDER_FULFILLMENT, "CREATED")
        order_wf.add_transition("CREATED", "PAID", "PAY_ORDER", "SYSTEM", description="Customer completed payment")
        order_wf.add_transition("PAID", "PROCESSING", "ACKNOWLEDGE_ORDER", "SELLER", description="Seller started picking/packing")
        order_wf.add_transition("PROCESSING", "SHIPPED", "DISPATCH_PACKAGE", "SELLER", description="Package handed over to carrier")
        order_wf.add_transition("SHIPPED", "DELIVERED", "CONFIRM_DELIVERY", "CARRIER", description="Carrier confirmed delivery at customer address")
        order_wf.add_transition("CREATED", "CANCELLED", "CANCEL_UNPAID", "CUSTOMER", is_terminal=True, description="Customer cancelled before checkout")
        order_wf.add_transition("PAID", "CANCELLED", "CANCEL_AND_REFUND", "ADMIN", is_terminal=True, description="Admin forced order cancellation")
        order_wf.add_transition("DELIVERED", "COMPLETED", "AUTO_FINALIZE", "SYSTEM", is_terminal=True, description="Order finalized after return window")
        cls.register_workflow(order_wf)

        # 2. RMA Processing Workflow
        rma_wf = WorkflowDefinition(WorkflowDomain.RMA_PROCESSING, "REQUESTED")
        rma_wf.add_transition("REQUESTED", "UNDER_REVIEW", "BEGIN_REVIEW", "SELLER", description="Seller reviewing return request")
        rma_wf.add_transition("UNDER_REVIEW", "APPROVED", "APPROVE_RETURN", "SELLER", description="Seller issued return label")
        rma_wf.add_transition("UNDER_REVIEW", "REJECTED", "REJECT_RETURN", "SELLER", description="Seller rejected invalid return claim")
        rma_wf.add_transition("REJECTED", "ESCALATED", "ESCALATE_TO_ADMIN", "CUSTOMER", description="Customer disputed rejection")
        rma_wf.add_transition("APPROVED", "SHIPPED_BACK", "TRACK_RETURN_PARCEL", "CUSTOMER", description="Customer dropped off return package")
        rma_wf.add_transition("SHIPPED_BACK", "INSPECTED", "INSPECT_RETURN", "SELLER", description="Warehouse verified item condition")
        rma_wf.add_transition("INSPECTED", "REFUNDED", "ISSUE_REFUND", "SYSTEM", is_terminal=True, description="Ledger credited refund balance")
        cls.register_workflow(rma_wf)

        # 3. Vendor Onboarding Workflow
        vendor_wf = WorkflowDefinition(WorkflowDomain.VENDOR_ONBOARDING, "APPLIED")
        vendor_wf.add_transition("APPLIED", "DOCS_PENDING", "REQUEST_DOCUMENTS", "ADMIN", description="Request tax/business certification")
        vendor_wf.add_transition("DOCS_PENDING", "UNDER_AUDIT", "SUBMIT_DOCS", "SELLER", description="Seller uploaded KYC documents")
        vendor_wf.add_transition("UNDER_AUDIT", "APPROVED", "APPROVE_STORE", "ADMIN", description="Store unlocked for live sales")
        vendor_wf.add_transition("UNDER_AUDIT", "REJECTED", "REJECT_STORE", "ADMIN", is_terminal=True, description="Application failed compliance")
        vendor_wf.add_transition("APPROVED", "SUSPENDED", "SUSPEND_STORE", "ADMIN", description="Admin halted store operations")
        vendor_wf.add_transition("SUSPENDED", "APPROVED", "REINSTATE_STORE", "ADMIN", description="Store resolved compliance issue")
        cls.register_workflow(vendor_wf)

    async def execute_transition(
        self,
        domain: WorkflowDomain,
        entity_id: str,
        current_state: str,
        action: str,
        user_id: str,
        user_role: str,
        context: Dict[str, Any],
    ) -> Tuple[bool, str, Optional[str]]:
        wf = self.get_workflow(domain)
        if not wf:
            return False, current_state, f"No workflow registered for domain {domain.value}"

        transition = wf.get_transition(current_state, action)
        if not transition:
            return False, current_state, f"Invalid action '{action}' from state '{current_state}'"

        if transition.required_role != "*" and transition.required_role != user_role:
            return False, current_state, f"Permission denied. Role '{user_role}' cannot perform '{action}'"

        if transition.guard_condition and not transition.guard_condition(context):
            return False, current_state, f"Workflow guard condition failed for action '{action}'"

        next_state = transition.to_state
        logger.info(f"[{domain.value}] Entity {entity_id}: Transitioning {current_state} -> {next_state} via {action} by {user_id}")

        for effect in transition.side_effects:
            try:
                if asyncio.iscoroutinefunction(effect):
                    await effect(context)
                else:
                    effect(context)
            except Exception as e:
                logger.error(f"Side-effect execution error in {action}: {e}")
                return False, current_state, f"Side effect failure: {str(e)}"

        return True, next_state, None


# Pre-initialize defaults on load
WorkflowEngine.initialize_default_workflows()
