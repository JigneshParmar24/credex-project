import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendAuditEmail(email, auditData) {

  const {
    totalMonthlySavings,
    totalAnnualSavings,
    results,
    summary
  } = auditData

  const toolRows = results.map(result => `

    <tr>

      <td style="padding:14px 0;border-bottom:1px solid #232323;">

        <div style="color:#ffffff;font-weight:500;font-size:14px;">
          ${result.toolName}
        </div>

        <div style="margin-top:4px;">

          <span style="
            display:inline-block;
            background:#1a1a1a;
            border:1px solid #2a2a2a;
            color:#737373;
            font-size:11px;
            padding:3px 8px;
            border-radius:999px;
            text-transform:capitalize;
          ">
            ${result.currentPlan}
          </span>

        </div>

      </td>

      <td style="
        padding:14px 0;
        border-bottom:1px solid #232323;
        text-align:right;
        color:#a3a3a3;
        font-size:14px;
      ">
        $${result.currentSpend}/mo
      </td>

      <td style="
        padding:14px 0;
        border-bottom:1px solid #232323;
        text-align:right;
      ">

        ${result.savings > 0
          ? `
            <span style="
              color:#ffffff;
              font-size:14px;
              font-weight:500;
            ">
              save $${result.savings}/mo
            </span>
          `
          : `
            <span style="
              color:#737373;
              font-size:14px;
            ">
              optimized
            </span>
          `
        }

      </td>

    </tr>

  `).join('')

  const html = `
    <!DOCTYPE html>

    <html>

      <body style="
        margin:0;
        padding:0;
        background:#0a0a0a;
        color:#ffffff;
        font-family:Inter,system-ui,sans-serif;
      ">

        <div style="
          max-width:640px;
          margin:0 auto;
          padding:48px 24px;
        ">

          <!-- Brand -->

          <div style="
            display:flex;
            align-items:center;
            gap:12px;
            margin-bottom:40px;
          ">

            <div style="
              width:32px;
              height:32px;
              border-radius:8px;
              background:#ffffff;
              color:#000000;
              font-size:14px;
              font-weight:700;
              display:flex;
              align-items:center;
              justify-content:center;
            ">
              B
            </div>

            <div>

              <div style="
                color:#ffffff;
                font-size:15px;
                font-weight:600;
              ">
                BurnRate
              </div>

              <div style="
                color:#737373;
                font-size:12px;
                margin-top:2px;
              ">
                AI spend intelligence
              </div>

            </div>

          </div>

          <!-- Hero -->

          <div style="
            background:#111111;
            border:1px solid #232323;
            border-radius:16px;
            padding:36px 28px;
            text-align:center;
            margin-bottom:28px;
          ">

            ${totalMonthlySavings > 0 ? `

              <div style="
                color:#a3a3a3;
                font-size:13px;
                margin-bottom:12px;
              ">
                Savings opportunity found
              </div>

              <div style="
                font-size:52px;
                font-weight:700;
                line-height:1;
                letter-spacing:-2px;
                margin-bottom:12px;
              ">
                $${totalMonthlySavings}/mo
              </div>

              <div style="
                color:#737373;
                font-size:15px;
              ">
                $${totalAnnualSavings}/year in potential savings
              </div>

            ` : `

              <div style="
                font-size:28px;
                font-weight:600;
                margin-bottom:12px;
              ">
                Your AI spend looks healthy
              </div>

              <div style="
                color:#737373;
                font-size:15px;
              ">
                No major optimization opportunities detected.
              </div>

            `}

          </div>

          <!-- Summary -->

          ${summary ? `

            <div style="
              background:#111111;
              border:1px solid #232323;
              border-radius:16px;
              padding:24px;
              margin-bottom:28px;
            ">

              <div style="
                display:inline-block;
                background:#1a1a1a;
                border:1px solid #2a2a2a;
                color:#a3a3a3;
                font-size:11px;
                padding:5px 10px;
                border-radius:999px;
                margin-bottom:16px;
              ">
                AI Analysis
              </div>

              <p style="
                margin:0;
                color:#d4d4d4;
                font-size:15px;
                line-height:1.8;
              ">
                ${summary}
              </p>

            </div>

          ` : ''}

          <!-- Breakdown -->

          <div style="
            background:#111111;
            border:1px solid #232323;
            border-radius:16px;
            padding:24px;
            margin-bottom:28px;
          ">

            <div style="
              color:#ffffff;
              font-size:16px;
              font-weight:600;
              margin-bottom:20px;
            ">
              Tool breakdown
            </div>

            <table style="
              width:100%;
              border-collapse:collapse;
            ">
              ${toolRows}
            </table>

          </div>

          <!-- Credex CTA -->

          ${totalMonthlySavings > 500 ? `

            <div style="
              background:#111111;
              border:1px solid #232323;
              border-radius:16px;
              padding:24px;
              margin-bottom:28px;
            ">

              <div style="
                color:#ffffff;
                font-size:18px;
                font-weight:600;
                margin-bottom:10px;
              ">
                Reduce spend further with Credex
              </div>

              <div style="
                color:#737373;
                font-size:14px;
                line-height:1.7;
                margin-bottom:18px;
              ">
                Teams with high AI usage often reduce infrastructure
                costs further through discounted AI credits and
                contract optimization.
              </div>

              <a
                href="https://credex.rocks"
                style="
                  display:inline-block;
                  background:#ffffff;
                  color:#000000;
                  padding:12px 18px;
                  border-radius:10px;
                  text-decoration:none;
                  font-size:14px;
                  font-weight:600;
                "
              >
                Book consultation →
              </a>

            </div>

          ` : ''}

          <!-- Footer -->

          <div style="
            border-top:1px solid #1f1f1f;
            padding-top:24px;
            color:#525252;
            font-size:12px;
            line-height:1.7;
          ">

            BurnRate is a free AI spend audit tool by
            <a
              href="https://credex.rocks"
              style="
                color:#a3a3a3;
                text-decoration:none;
              "
            >
              Credex
            </a>.

            We help startups optimize AI infrastructure costs.

          </div>

        </div>

      </body>

    </html>
  `

  try {

    const { data, error } = await resend.emails.send({
      from: 'BurnRate <onboarding@resend.dev>',
      to: email,

      subject:
        totalMonthlySavings > 0
          ? `BurnRate — $${totalMonthlySavings}/mo savings found`
          : `BurnRate — AI spend audit`,

      html
    })

    if (error) {
      throw new Error(error.message)
    }

    return {
      success: true,
      id: data.id
    }

  } catch (error) {

    console.error('Email send failed:', error.message)

    return {
      success: false,
      error: error.message
    }
  }
}