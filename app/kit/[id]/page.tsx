import { notFound } from "next/navigation";
import { canManage, getSession } from "@/lib/auth";
import { formatRwf, provenTotal } from "@/lib/gate";
import { getKit } from "@/lib/kits";
import { ApproveButton } from "./approve-button";
import { KitActions } from "./kit-actions";

export default async function KitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [kit, session] = await Promise.all([getKit(id), getSession()]);
  if (!kit) notFound();
  const total = provenTotal(kit.lines);
  const blanks = kit.lines.filter((l) => l.status === "blank").length;
  const owner = canManage(session, kit.userId, Boolean(kit.publicSeed));

  return (
    <main className="shell">
      <div className="kit-head">
        <div>
          <div className={`pill ${kit.source}`}>{kit.source === "seed" ? "Seeded kit" : "Live Token Factory"}</div>
          <h1>{kit.shopNameRw}</h1>
          <p className="lede">{kit.shopName} · {kit.place}</p>
        </div>
        <div>
          <div className="eyebrow">Proven total</div>
          <h1>{formatRwf(total)}</h1>
        </div>
      </div>

      <div className="yes-bar">
        <div>
          {kit.approved
            ? `YES recorded ${kit.approvedAt}. Kora still did not send money.`
            : `${blanks} line${blanks === 1 ? "" : "s"} left blank. A person still has to tap YES.`}
        </div>
        {owner ? <ApproveButton id={kit.id} approved={kit.approved} /> : <p className="eyebrow">Log in as the owner to record YES.</p>}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Page</th>
              <th>Item</th>
              <th>Qty</th>
              <th>Amount</th>
              <th>Seal</th>
            </tr>
          </thead>
          <tbody>
            {kit.lines.map((line) => (
              <tr key={line.id}>
                <td>{line.raw}</td>
                <td>
                  <div>{line.itemRw}</div>
                  <div className="eyebrow">{line.item}</div>
                  {line.tavilyNote ? <div className="lede">{line.tavilyNote}</div> : null}
                </td>
                <td>{line.quantity ?? "—"}</td>
                <td>{formatRwf(line.amountRwf)}</td>
                <td>
                  <div className={`status ${line.status}`}>{line.status}</div>
                  <div className="eyebrow">{line.reason}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {kit.paypal ? (
        <div className="yes-bar">
          <div>
            <div className="eyebrow">PayPal · {kit.paypal.mode}</div>
            <div>
              {kit.paypal.status}
              {kit.paypal.invoiceId ? ` · ${kit.paypal.invoiceId}` : ""}
            </div>
            <div className="lede">{kit.paypal.note}</div>
          </div>
        </div>
      ) : null}

      <div className="two">
        <div>
          <div className="eyebrow">WhatsApp · Kinyarwanda</div>
          <pre className="paste">{kit.whatsappRw}</pre>
        </div>
        <div>
          <div className="eyebrow">WhatsApp · English</div>
          <pre className="paste">{kit.whatsappEn}</pre>
        </div>
      </div>

      <KitActions id={kit.id} notes={kit.notes} canEdit={owner} canDelete={owner && !kit.publicSeed} />

      <section className="obs">
        <div className="eyebrow">Observatory · Token Factory receipts</div>
        {kit.observatory.map((call, i) => (
          <div className="obs-row" key={`${call.agent}-${i}`}>
            <strong>{call.agent}</strong>
            <span>
              {call.model}
              <div className="eyebrow">{call.endpoint}</div>
            </span>
            <span>{call.promptTokens + call.completionTokens} tok</span>
            <span>{call.ms} ms</span>
          </div>
        ))}
      </section>
    </main>
  );
}
