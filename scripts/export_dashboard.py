"""Export a contact-free dashboard snapshot from the hackathon sandbox."""
import json
import sqlite3
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
con = sqlite3.connect(f"file:{ROOT / 'data/store.db'}?mode=ro", uri=True)
con.row_factory = sqlite3.Row
now = con.execute("SELECT value FROM sandbox_info WHERE key='sandbox_now'").fetchone()[0]
def rows(sql, params=()):
    return [dict(row) for row in con.execute(sql, params)]
tickets = rows('''SELECT t.id, t.ticket_number, t.branch_id, b.code branch_code, b.name branch_name,
 t.category,t.priority,t.status,t.subject,t.description,t.created_at,t.first_response_at,t.assigned_staff_id,
 ROUND(julianday(?) - julianday(t.created_at),1) age_days,
 o.created_at order_created_at,o.order_number,o.total order_total,o.status order_status,o.channel order_channel,
 d.status delivery_status,d.promised_by,d.delivered_at,d.failure_reason
 FROM support_tickets t LEFT JOIN branches b ON b.id=t.branch_id
 LEFT JOIN orders o ON o.id=t.order_id LEFT JOIN deliveries d ON d.order_id=t.order_id
 WHERE t.status IN ('open','pending') ORDER BY t.created_at''', (now,))
csrs = rows('''SELECT s.id, s.first_name || ' ' || s.last_name name,
 COUNT(t.id) workload FROM staff s LEFT JOIN support_tickets t
 ON t.assigned_staff_id=s.id AND t.status IN ('open','pending')
 WHERE s.role='csr' AND s.status='active' GROUP BY s.id ORDER BY workload,s.id''')
data = {'sandbox_now':now,'tickets':tickets,'csrs':csrs,'branches':rows('SELECT id,code,name FROM branches ORDER BY code')}
path = ROOT / 'frontend/public/sandbox.json'
path.write_text(json.dumps(data, ensure_ascii=False), encoding='utf-8')
con.close()
print(f'Exported {len(tickets)} unresolved tickets and {len(csrs)} CSRs')
