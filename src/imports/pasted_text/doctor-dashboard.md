Design a "Doctor Dashboard" for a clinic software called RheumaLink. This is the doctor-facing 
counterpart to the Compounder Dashboard (same visual language: dark navy top bar, teal/green 
accent color "RheumaLink" branding, soft blue/teal/white content area, rounded cards with soft 
shadows, clean readable fonts). This dashboard is bigger and more detailed than the compounder one, 
so use clear section dividers, collapsible/expandable panels, and generous whitespace so it never 
feels overwhelming despite having more content.

=====================================================
TOP NAVIGATION BAR (dark navy, same as compounder dashboard)
=====================================================
- Left: RheumaLink logo
- Center-left: Greeting text "Hello, Dr. [Doctor Name]"
- Right: "Voice-to-Text Language" dropdown with globe/mic icon, default "English"
- Far right: "Logout" button (outline style, icon of a door/exit)

=====================================================
PAGE HEADER
=====================================================
- Section title: "Doctor Desk"
- Primary button, top-right: "Upload Patient Lab Reports" (upload icon)

=====================================================
PATIENT & FILE SEARCH
=====================================================
Same style as compounder dashboard — a card with a search bar, placeholder 
"Search by name, contact, or file number", search icon/button

=====================================================
TODAY'S SUMMARY (4 STAT CARDS IN A ROW)
=====================================================
Four small stat cards side by side, each with an icon and large number:
1. "Waiting" — number, gray/blue icon (clock)
2. "Attending" — number, orange/amber icon (stethoscope)
3. "Attended" — number, green icon (checkmark)
4. "Total Today" — number, navy icon (calendar)

=====================================================
ATTENDING PATIENTS (TABLE)
=====================================================
Card titled "Attending Patients"
Columns: Token | Patient | Joint Chart | Status Update | Action
- Empty state row: "No patient currently in consultation." (gray italic text)
- Action column has a button like "View & Consult"

=====================================================
ATTENDED PATIENTS (TABLE)
=====================================================
Card titled "Attended Patients"
Columns: Token | Patient | Joint Chart | Status | Action
- Empty state row: "No attended patient yet." (gray italic text)
- Status column shows a green "Attended" pill badge
- Action column has a button like "View Summary"

NOTE: Clicking "Action" on either table opens a slide-over panel/modal titled 
"Patient Summary" showing: the compounder-filled medical history (blood group, allergies, 
comorbidities, family history) and the recorded vitals (weight, height, BP, pulse, SpO2, 
temp, pain scale) in a clean read-only summary card layout with labeled fields.

=====================================================
FORM 1: CONSULTATION + PRESCRIPTION
=====================================================
This is the main, larger form. Structure it as a single scrollable page with clear subsections 
and dividers. Include a toggle at the top: "Manual Entry" | "Dictation Mode" (segmented control).

--- Dictation Panel (shown when Dictation Mode is selected) ---
A highlighted card with:
- Title: "🎙️ AI Smart Dictation (MedASR)"
- Status pill: "Ready" (green dot)
- Large circular mic button, center-aligned, to start/stop recording
- Tip box below (light yellow/info background): 
  "💡 Dictation Tip: For best results, dictate in this order: Chief Complaints → Clinical Findings 
  → Provisional Diagnosis → Prescribed Medications (with Dosage, Duration & Instructions) → 
  Lab Tests → Follow-up Timeline."

--- Consultation Fields (auto-filled by dictation OR typed manually) ---
- Chief Complaints (text area)
- Clinical Findings (text area)
- Provisional Diagnosis (text area)

--- Prescribed Medications (repeatable row group) ---
Table-style repeatable rows with columns: Medicine Name | Dosage | Duration | Instructions
- "+ Add Medicine" button below the rows to add another row
- Each row has a small trash/delete icon on the right

--- 🧪 Prescribe Lab Tests ---
Section header: "🧪 Prescribe Lab Tests"
Sub-label: "Common Tests:" followed by a checkbox/chip grid (multi-select pill buttons) with:
ANA (Antinuclear Antibody) by IFA, Anti-CCP (Cyclic Citrullinated Peptide), 
Complete Blood Count (CBC), C-Reactive Protein (CRP), Erythrocyte Sedimentation Rate (ESR), 
HLA-B27 by PCR, Rheumatoid Factor (RF) Quantitative, Serum Uric Acid
Sub-label: "Search & Add Other Tests:" — search input field with a 🎙️ mic icon inside it

--- Follow-up Timeline ---
Label: "Next Follow-up Date:"
Row of quick-select pill buttons: "1 Week" | "2 Weeks" | "1 Month" | "2 Months" | "3 Months"
(plus a small calendar icon to pick a custom date)

--- Post Consultation Status ---
Label: "Post Consultation Status"
Dropdown or segmented control, default value "Attended", with an alternate option 
(e.g., "Attended" | "Follow-up Required" — keep simple, 2 options)

--- Bottom action ---
Primary button, full width or bottom-right: "Save Consultation & Generate PDF"
(On click, this leads to a Prescription Preview screen — dark sidebar with patient info 
and a "Send to Patient via WhatsApp" button, next to a live PDF preview of the prescription 
— consistent with the already-approved Prescription Preview screen design.)

=====================================================
FORM 2: DIAGNOSIS BOOK PAGE
=====================================================
A separate page/tab titled "Diagnosis Book"
Fields at top:
- Appointment (dropdown, shows selected patient/appointment)
- Disease Name (text/dropdown input)
- Stage (text/dropdown input)
- Version Note (text area, small)

--- Joint Chart Entry ---
A card row with:
- Label: "Joint Chart Entry"
- Status pill: "✅ Completed (5 Swollen, 10 Tender)" (green badge with counts)
- Helper text: "Joint chart is managed on a separate page. Create or view before saving diagnosis."
- Button: "Open Joint Chart Page" (outline button, opens in new context — design of that 
  page to be done later, just needs the entry point here)

--- Rheumatoid Symptoms Checklist ---
A card row with:
- Label: "Rheumatoid Symptoms Checklist (AI Summary)"
- Status pill: "✅ Completed" (green badge)
- Helper text: "Fill detailed symptoms checklist and generate professional clinical notes using 
  AI on a separate page."
- Button: "Open Rheum Diagnosis Page" (outline button, entry point only, design later)

--- Fast DAS28 Score ---
A card row with:
- Label: "Fast DAS28 Score"
- Button: "Calculate for Selected Appointment" (primary small button)
- Space below to show a result (e.g., a score badge/number once calculated) — leave as a 
  placeholder result area

--- Bottom action ---
Primary button: "Save Diagnosis" (bottom-right, full width on mobile)

=====================================================
STYLE NOTES
=====================================================
- Keep the same dark navy top bar + teal accents from the Compounder Dashboard and 
  Prescription Preview screen for visual consistency across the product
- Use status pill badges consistently: gray = waiting, amber/orange = in progress, 
  green = completed/attended
- Icons next to every section title for quick scanning (🎙️ mic, 🧪 lab, 📋 clipboard, 📅 calendar)
- Cards should have soft shadows, 12px rounded corners, clear spacing between sections 
  so the long consultation form doesn't feel overwhelming — consider subtle section 
  dividers or numbered steps (1. Consultation Notes → 2. Medications → 3. Lab Tests → 
  4. Follow-up → 5. Status)
- This is still meant for doctors who are busy and not deeply technical — prioritize speed 
  (big buttons, dictation-first workflow, minimal typing) over dense information display
- Responsive layout, tablet-friendly since doctors may use this on a tablet in the consultation room