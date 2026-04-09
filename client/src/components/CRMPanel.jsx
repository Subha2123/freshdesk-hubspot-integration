export default function CRMPanel({ crm }) {
  if (!crm) return <p>No CRM data</p>;

  return (
    <div>
      <h3 className="font-bold mb-2">Customer Info</h3>
      <p>Name: {crm.name}</p>
      <p>Email: {crm.email}</p>
      <p>Company: {crm.company}</p>
    </div>
  );
}
