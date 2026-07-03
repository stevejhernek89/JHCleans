export interface GuideField {
  name: string;
  where: string;
  what: string;
  how: string;
  example?: string;
  tip?: string;
}

export interface GuideTable {
  headers: string[];
  rows: string[][];
}

export interface GuideSection {
  id: string;
  title: string;
  description?: string;
  fields?: GuideField[];
  bullets?: { title: string; description: string }[];
  table?: GuideTable;
  subsections?: GuideSection[];
}

export const ADMIN_GUIDE_SECTIONS: GuideSection[] = [
  {
    id: "login",
    title: "Logging In",
    description:
      "Go to /admin/login on your website. There is no username — only a password. It is case-sensitive. The password is set in the ADMIN_PASSWORD environment variable on the server.",
    fields: [
      {
        name: "Password",
        where: "The login screen — a single box with a lock icon, centered on a dark card.",
        what: "The secret word that unlocks the admin area.",
        how: "Type the admin password exactly as it was set, then click Sign In. If it fails, the box shows a red error message.",
        tip: "If you forget the password, someone with server access must update ADMIN_PASSWORD and restart the site.",
      },
    ],
  },
  {
    id: "navigation",
    title: "Sidebar Navigation",
    description:
      "After login, the dark sidebar on the left (or slide-out menu on phones) shows the main areas. The highlighted item is the page you are on.",
    table: {
      headers: ["Menu Item", "What It Does", "Has Form Fields?"],
      rows: [
        ["Dashboard", "Quick stats, new booking requests, upcoming jobs, recent money entries", "No — view only"],
        ["Site Content", "Edit all website text, pricing, FAQs, legal pages, etc.", "Yes — main content editor"],
        ["Calendar", "See jobs on a calendar; add, edit, drag to reschedule", "Yes — job form popup"],
        ["Finances", "Charts and list of revenue/expenses", "Yes — transaction popup"],
        ["Guide", "Field-by-field instructions", "No — read only"],
        ["AI Consultant", "Chat assistant trained on JHCleans business and admin", "No — ask questions"],
        ["Sign out", "Logs you out safely", "No"],
      ],
    },
  },
  {
    id: "dashboard",
    title: "Dashboard",
    description:
      "Your home screen after login. You cannot type into anything here — you read it and click links to manage things elsewhere.",
    bullets: [
      { title: "Revenue (This Month)", description: "Green dollar card — total money earned this calendar month." },
      { title: "Expenses (This Month)", description: "Amber card — money spent on supplies, fuel, etc. this month." },
      { title: "Net Profit", description: "Revenue minus expenses. Green if positive, red if negative." },
      { title: "Pending Requests", description: "New bookings from the website waiting for confirmation. Click Manage in calendar." },
      { title: "Jobs Today", description: "How many cleanings are scheduled for today." },
      { title: "Upcoming Jobs", description: "Future scheduled jobs (not cancelled or completed)." },
      { title: "Completed Jobs", description: "Total finished jobs in the system." },
      { title: "New Cleaning Requests", description: "Customer name, job title, date submitted, and booking reference with an orange Pending badge." },
      { title: "Recent Transactions", description: "Last 5 money entries. Green + for revenue, amber − for expenses." },
    ],
  },
  {
    id: "site-content",
    title: "Site Content — Overview",
    description:
      "Click Site Content in the sidebar. On the left is a list of 14 categories. Click one, edit fields on the right, then click Save Section at the bottom. Reset to Defaults restores the original template for that category only. Changes do not go live until you save. Switching categories without saving may lose unsaved work.",
  },
  {
    id: "business",
    title: "Business Info",
    description: "Core company details shown in the header, footer, and contact page.",
    fields: [
      { name: "Business Name", where: "Site header, page titles, footer.", what: "The official company name.", how: "Type the full name customers should recognize.", example: "JHCleans.com" },
      { name: "Short Name", where: "Admin sidebar and compact mobile header spots.", what: "A shorter brand name.", how: "Use the brand without extra words.", example: "JHCleans" },
      { name: "Tagline", where: "Under the logo or in hero sections.", what: "One catchy line summarizing what you do.", how: "Keep it under ~8 words.", example: "Cleaner Cans. Fresher Homes." },
      { name: "Description", where: "SEO meta description and about snippets.", what: "A 1–2 sentence service summary.", how: "Write in complete sentences.", example: "Professional garbage-can cleaning, sanitizing, and deodorizing delivered right to your curb." },
      { name: "Phone", where: "Contact page, footer, call buttons.", what: "Human-readable phone number.", how: "Format how people normally dial it.", example: "(555) 123-4567", tip: "This is different from the tel link — use normal formatting here." },
      { name: "Phone (tel link)", where: "Invisible click-to-call link on mobile.", what: "Special format for tap-to-call.", how: "Digits only with country code, no spaces.", example: "+15551234567", tip: "If empty, click-to-call may not work on phones." },
      { name: "Email", where: "Contact page and footer mailto links.", what: "Business email customers write to.", how: "Use a real inbox someone checks daily.", example: "hello@jhcleans.com" },
      { name: "Address Display", where: "Contact page address line.", what: "How the address is written out.", how: "City/region is fine if you skip a street address.", example: "Serving the Greater Springfield Area" },
      { name: "City", where: "Structured address data.", what: "Primary service city.", how: "City name only.", example: "Springfield" },
      { name: "State", where: "Structured address data.", what: "Two-letter US state code.", how: "Exactly 2 capital letters.", example: "MO" },
      { name: "Weekday Hours", where: "Contact page Business Hours — weekdays line.", what: "Weekday availability.", how: "Day range and times in plain English.", example: "Monday – Friday: 8 AM – 6 PM" },
      { name: "Saturday Hours", where: "Contact page hours — Saturday line.", what: "Saturday availability.", how: "Write Closed if you do not work Saturdays.", example: "Saturday: 9 AM – 2 PM" },
      { name: "Sunday Hours", where: "Contact page hours — Sunday line.", what: "Sunday availability.", how: "Most businesses put Closed.", example: "Sunday: Closed" },
      { name: "Hours Note", where: "Small text under the hours list.", what: "Extra reachability info.", how: "Mention 24/7 online booking if applicable.", example: "Online booking available 24/7" },
      { name: "Facebook URL", where: "Footer social icon (only shows if filled).", what: "Full Facebook page link.", how: "Paste complete https:// URL or leave blank.", example: "https://facebook.com/jhcleans" },
      { name: "Instagram URL", where: "Footer Instagram icon.", what: "Full Instagram profile link.", how: "Full URL or leave empty.", example: "https://instagram.com/jhcleans" },
      { name: "TikTok URL", where: "Footer TikTok icon.", what: "Full TikTok profile link.", how: "Full URL or leave empty." },
      { name: "Yelp URL", where: "Footer Yelp icon.", what: "Yelp business page URL.", how: "Full URL or leave empty." },
      { name: "Google URL", where: "Footer Google icon.", what: "Google Business Profile or Maps link.", how: "Full URL or leave empty." },
      { name: "Satisfaction Guarantee", where: "Trust badges and homepage marketing copy.", what: "Your promise if a customer is unhappy.", how: "1–3 sentences. Only claim what you can honor.", example: "If you are not satisfied, contact us within 48 hours and we will make it right." },
    ],
  },
  {
    id: "nav-links",
    title: "Navigation",
    description:
      "A list of header menu links. Order top-to-bottom = left-to-right on the website. Use Add Item for new links and Remove to delete.",
    fields: [
      { name: "Label", where: "Top navigation bar on every public page.", what: "Text visitors see.", how: "Keep it short (1–3 words).", example: "Pricing" },
      { name: "URL", where: "Where the link goes when clicked.", what: "Page path or anchor.", how: "Start with / for internal pages. Use /#faq to jump to a homepage section.", example: "/pricing or /#how-it-works", tip: "Broken URLs = 404 pages. Double-check spelling." },
    ],
  },
  {
    id: "layout",
    title: "Buttons & CTAs",
    description: "CTA = Call To Action — buttons that push visitors to book or get a quote.",
    fields: [
      { name: "Header CTA", where: "Top-right green button on desktop header.", what: "Main navigation action button.", how: "Short action phrase, 2–3 words.", example: "Book Now" },
      { name: "Mobile Quote CTA", where: "Sticky bottom bar on phones — left button.", what: "Secondary quote action on mobile.", how: "Short label.", example: "Get Quote" },
      { name: "Mobile Book CTA", where: "Sticky bottom bar on phones — right primary button.", what: "Main booking action on mobile.", how: "Short label.", example: "Book Now" },
      { name: "Footer Book Label", where: "Footer book link text.", what: "Footer booking link label.", how: "Can match Header CTA.", example: "Book Now" },
    ],
  },
  {
    id: "homepage",
    title: "Homepage",
    description: "Controls the main landing page — hero, section titles, bottom banner, and pricing preview cards.",
    subsections: [
      {
        id: "homepage-hero",
        title: "Hero (first screen)",
        fields: [
          { name: "Badge", where: "Small pill above the main headline.", what: "Short service type label.", how: "3–6 words.", example: "Professional Curbside Service" },
          { name: "Headline", where: "Large main text, first line.", what: "Primary headline.", how: "Can end with a comma if accent continues the sentence.", example: "Professional Garbage Can Cleaning," },
          { name: "Headline Accent", where: "Second headline line in bright color.", what: "Emphasis words.", how: "Completes the headline.", example: "Sanitizing & Deodorizing" },
          { name: "Primary CTA", where: "Big green hero button.", what: "Main button text.", how: "Action-oriented, 2–4 words.", example: "Book a Cleaning" },
          { name: "Secondary CTA", where: "Outline button next to primary.", what: "Alternative for visitors not ready to book.", how: "Often Get a Quote or Learn More.", example: "Get a Free Quote" },
          { name: "Trust Indicators (one per line)", where: "Bullets under hero buttons.", what: "Quick trust points.", how: "Press Enter between each line. Each line = one bullet.", example: "Convenient curbside service\nFamily-focused local business" },
        ],
      },
      {
        id: "homepage-sections",
        title: "Section Headings",
        fields: [
          { name: "How It Works Title / Subtitle", where: "Above the 4-step process.", what: "Section heading and gray subtext.", how: "Clear, friendly text.", example: "How It Works / Four simple steps to cleaner, fresher bins" },
          { name: "Pricing Title / Subtitle", where: "Above homepage pricing preview cards.", what: "Pricing section headings.", how: "Match your pricing message.", example: "Simple, Transparent Pricing" },
          { name: "Testimonials Title", where: "Above customer quotes.", what: "Testimonials heading.", how: "Short title.", example: "What Our Customers Say" },
          { name: "FAQ Title", where: "Above accordion questions.", what: "FAQ section heading.", how: "Standard FAQ title.", example: "Frequently Asked Questions" },
          { name: "Service Area Title / Subtitle", where: "Above ZIP code checker.", what: "Service area headings.", how: "Invite ZIP lookup.", example: "Service Area / Check if we service your ZIP code." },
        ],
      },
      {
        id: "homepage-final-cta",
        title: "Final CTA (bottom banner)",
        fields: [
          { name: "Title", where: "Large text in bottom band.", what: "Closing headline.", how: "Motivational question or statement.", example: "Ready for Cleaner, Fresher Cans?" },
          { name: "Body", where: "Paragraph under title.", what: "Extra push to act.", how: "1–2 sentences.", example: "Book your first cleaning today..." },
          { name: "Primary CTA / Secondary CTA", where: "Buttons in the bottom band.", what: "Book and quote actions.", how: "Same style as hero buttons.", example: "Book a Cleaning / Request a Quote" },
        ],
      },
      {
        id: "homepage-pricing-preview",
        title: "Homepage Pricing Preview",
        description: "Simplified plan cards on the homepage (not the full /pricing page). Use Add Item for another card.",
        fields: [
          { name: "Name", where: "Bold plan name on card.", what: "Plan title.", how: "Short name.", example: "Monthly Plan" },
          { name: "Price", where: "Big price display.", what: "Displayed cost.", how: "Include $ sign.", example: "$25" },
          { name: "Description", where: "Gray text under name.", what: "One-line summary.", how: "Keep brief.", example: "Keep your bins fresh all month." },
          { name: "Note", where: "Small text under price.", what: "Billing or unit note.", how: "Clarify per-bin or billing.", example: "per bin · Billed monthly" },
        ],
      },
    ],
  },
  {
    id: "pages",
    title: "Page Headings",
    description: "Big title and subtitle at the top of individual pages (not the homepage).",
    fields: [
      { name: "Services Title / Subtitle / CTA Label", where: "Top of /services page and service card buttons.", what: "Services page headings and button text.", how: "Title + 1–2 sentence subtitle + action on cards.", example: "Our Services / Book This Service" },
      { name: "Contact Title / Subtitle", where: "Top of /contact page.", what: "Contact page headings.", how: "Welcoming title and invite to reach out.", example: "Contact Us / Have a question? We're here to help." },
      { name: "Book Title / Subtitle", where: "Top of /book page above the form.", what: "Booking page headings.", how: "Tell visitors they are requesting a cleaning.", example: "Book a Cleaning" },
      { name: "Pricing Quote Title / Subtitle", where: "Callout box on /pricing page.", what: "Custom quote section.", how: "Encourage quote requests.", example: "Need a Custom Quote?" },
    ],
  },
  {
    id: "features",
    title: "Features",
    description: "Feature cards in a grid on the homepage — icon, title, and description for each benefit.",
    fields: [
      { name: "Title", where: "Bold text on each card.", what: "Benefit name.", how: "2–4 words.", example: "Deep Cleaning" },
      { name: "Icon", where: "Small icon above title.", what: "Icon keyword from Lucide icons.", how: "Lowercase names: sparkles, wind, shield, truck, calendar, refresh-cw, droplets, map-pin, leaf, smile.", example: "sparkles", tip: "Wrong name = missing or default icon." },
      { name: "Description", where: "Gray paragraph on card.", what: "Benefit explanation.", how: "1–2 sentences.", example: "High-pressure washing removes grime..." },
    ],
  },
  {
    id: "howItWorksSteps",
    title: "How It Works",
    description: "Numbered steps in a row on the homepage. Each list item = one step.",
    fields: [
      { name: "Title", where: "Step name under the number.", what: "What happens in this step.", how: "Short verb phrase.", example: "Book Online" },
      { name: "Step Number", where: "Big number circle (1, 2, 3, 4).", what: "Step order.", how: "Whole numbers in order.", example: "1" },
      { name: "Description", where: "Text under title.", what: "Step details.", how: "1–2 sentences.", example: "Choose your service, pick a date..." },
    ],
  },
  {
    id: "pricing",
    title: "Pricing Plans",
    description: "Full pricing cards on /pricing — more detailed than Homepage Pricing Preview.",
    fields: [
      { name: "Recurring Savings Label", where: "Badge on recurring plans.", what: "Text next to savings percent.", how: "Short phrase.", example: "Save with recurring plans" },
      { name: "Savings Percent", where: "Numeric savings badge.", what: "How much cheaper recurring is.", how: "Number only, no % sign. Leave empty if unknown.", example: "20" },
      { name: "Name / Price Label / Description / Price Note", where: "Each plan card.", what: "Plan identity and pricing display.", how: "Name, price with $, who it's for, billing note.", example: "Monthly Plan / $25 / per bin · Billed monthly" },
      { name: "CTA Label / CTA Link", where: "Button on plan card.", what: "Button text and destination.", how: "Usually Book Now → /book", example: "Book Now / /book" },
      { name: "Features (one per line)", where: "Checkmark list on card.", what: "Included items.", how: "One feature per line — each becomes a bullet.", example: "Exterior & interior cleaning\nSanitizing treatment" },
    ],
  },
  {
    id: "services",
    title: "Services",
    description: "Detailed offerings on /services — one list item per service type.",
    fields: [
      { name: "Name / Price Label", where: "Service card heading and price.", what: "Service name and displayed price.", how: "Clear name + starting price.", example: "Residential Bin Cleaning / From $35/bin" },
      { name: "Description / Duration", where: "Card body and time badge.", what: "What it includes and time estimate.", how: "Paragraph + short duration.", example: "~15 min per bin" },
      { name: "Booking Link", where: "Book button destination.", what: "Where Book goes.", how: "Usually /book.", example: "/book" },
      { name: "Included (one per line)", where: "Bullet list on card.", what: "What's included.", how: "One item per line.", example: "Pressure wash interior & exterior\nEco-friendly sanitizing" },
    ],
  },
  {
    id: "faq",
    title: "FAQ",
    description: "Accordion on homepage — click a question to expand the answer.",
    fields: [
      { name: "Question", where: "Bold clickable row.", what: "What customers ask.", how: "Write as a real question ending with ?", example: "Do I need to be home?" },
      { name: "Answer", where: "Hidden expandable text.", what: "Your clear answer.", how: "2–5 sentences in plain language.", example: "No. As long as your bins are accessible..." },
    ],
  },
  {
    id: "testimonials",
    title: "Testimonials",
    description: "Customer quote section on homepage. Only use real reviews you have permission to publish.",
    fields: [
      { name: "Quote", where: "Large quote text.", what: "What the customer said.", how: "1–3 sentences, first person.", example: "Our bins have never smelled this good!" },
      { name: "Author", where: "Name under quote.", what: "Customer name.", how: "First + last initial or full name.", example: "Sarah M." },
      { name: "Location", where: "Under author name.", what: "City or neighborhood.", how: "Short location.", example: "Springfield, MO" },
    ],
  },
  {
    id: "about",
    title: "About",
    fields: [
      { name: "Headline", where: "Top of /about page.", what: "Main about title.", how: "Welcoming headline about your story.", example: "Built by Neighbors, for Neighbors" },
      { name: "Story (one paragraph per line)", where: "Body paragraphs on about page.", what: "Origin story and mission.", how: "Separate paragraphs with a blank line (Enter twice).", tip: "Single Enter = same paragraph. Double Enter = new paragraph." },
      { name: "Founders Note", where: "Signed note from founders.", what: "Personal closing message.", how: "Short sign-off.", example: "— The JHCleans Team" },
      { name: "Values — Title / Description", where: "Principle cards on about page.", what: "Each value name and explanation.", how: "Add items for each core value.", example: "Quality / We never cut corners on a clean." },
    ],
  },
  {
    id: "serviceArea",
    title: "Service Area",
    description: "Powers the ZIP code checker on the homepage.",
    fields: [
      { name: "Region Label", where: "Heading above city list.", what: "Geographic area name.", how: "Name your region.", example: "Greater Springfield Area" },
      { name: "Map Note", where: "Text near map or ZIP tool.", what: "Extra geography info.", how: "Mention expansion if relevant." },
      { name: "Serviced ZIP Codes (comma separated)", where: "Green yes-we-serve-you message.", what: "Confirmed service ZIPs.", how: "5-digit ZIPs separated by commas.", example: "65801, 65802, 65803", tip: "Wrong ZIPs = lost customers." },
      { name: "Maybe ZIP Codes (comma separated)", where: "Yellow maybe message.", what: "Borderline or on-request areas.", how: "Same comma format.", example: "65804, 65810" },
      { name: "Featured Cities — City / State", where: "Highlighted cities list.", what: "Cities you showcase.", how: "City name + 2-letter state.", example: "Springfield / MO" },
    ],
  },
  {
    id: "legal",
    title: "Legal Pages",
    description: "Privacy Policy, Terms of Service, Cancellation Policy, and Service Agreement. Have a lawyer review before launch.",
    fields: [
      { name: "Last Updated", where: "Top of each legal page.", what: "Date policy was last revised.", how: "Human-readable date.", example: "March 15, 2026" },
      { name: "Section Title", where: "Bold heading within page.", what: "Legal section topic.", how: "Clear section name.", example: "Information We Collect" },
      { name: "Section Content", where: "Text under section title.", what: "Actual legal text.", how: "Complete sentences. Add Item for new sections.", tip: "Replace all [UPDATE...] placeholders before launch." },
    ],
  },
  {
    id: "calendar",
    title: "Calendar & Jobs",
    description:
      "Click empty calendar space to create a job, click a job to edit, drag to reschedule. Use filter buttons and New Job for a blank form.",
    table: {
      headers: ["Status", "Color", "When to Use"],
      rows: [
        ["Pending", "Orange", "New website booking — not confirmed yet"],
        ["Scheduled", "Cyan", "Confirmed and on the calendar"],
        ["In Progress", "Purple", "Crew is actively cleaning"],
        ["Completed", "Green", "Job finished successfully"],
        ["Cancelled", "Gray", "Job won't happen"],
      ],
    },
    fields: [
      { name: "Job Title", where: "Calendar block and job lists.", what: "Short recognizable job name.", how: "Customer name + service type. Required.", example: "Smith Residence — Monthly" },
      { name: "Customer Name / Phone / Email", where: "Job record and contact info.", what: "Who booked the job.", how: "Full name, 10+ digit phone, valid email. All required.", example: "John Smith / 555-123-4567 / john@email.com" },
      { name: "Street Address / City / State / ZIP", where: "Where bins are located.", what: "Full job address.", how: "Street required. State = 2 letters. ZIP = 5 digits.", example: "123 Oak St / Springfield / MO / 65801" },
      { name: "Service Type", where: "Dropdown on job form.", what: "One-Time, Monthly, Bi-Weekly, or Multi-Can.", how: "Pick the plan type." },
      { name: "Garbage Cans / Recycling Cans", where: "Number inputs.", what: "How many bins to clean.", how: "Whole numbers 0–20. Usually at least 1 garbage can.", example: "2 / 1" },
      { name: "Time Window", where: "Dropdown.", what: "Morning, Afternoon, or Flexible arrival preference.", how: "Pick what the customer requested." },
      { name: "Status", where: "Dropdown and quick-status buttons.", what: "Job lifecycle stage.", how: "Pending → Scheduled when confirmed → Completed when done." },
      { name: "Start / End", where: "Datetime pickers.", what: "Calendar block start and end.", how: "End must be after start. Required.", example: "2026-07-15 09:00 / 10:00" },
      { name: "Revenue ($)", where: "Job form only (not auto-added to Finances).", what: "Expected earnings.", how: "Number, can use cents. 0 if not priced yet.", tip: "Add a Finances transaction separately to track in reports." },
      { name: "Notes", where: "Internal only — not on public site.", what: "Gate codes, dogs, special instructions.", how: "Optional, max 500 characters.", example: "Blue house, bins on left side of driveway" },
    ],
  },
  {
    id: "finances",
    title: "Finances & Transactions",
    description: "Summary cards, charts, and transaction table. Click Add Transaction or Edit on a row.",
    table: {
      headers: ["Category", "Use For"],
      rows: [
        ["Cleaning Supplies", "Soap, deodorizer, chemicals"],
        ["Equipment", "Pressure washer parts, hoses"],
        ["Fuel & Transport", "Gas, vehicle costs"],
        ["Marketing", "Ads, flyers, website"],
        ["Insurance", "Business insurance"],
        ["Other", "Anything else"],
      ],
    },
    fields: [
      { name: "Type", where: "Revenue or Expense dropdown.", what: "Money in vs money out.", how: "Revenue when paid. Expense when buying for the business." },
      { name: "Category", where: "Expense dropdown only.", what: "Expense kind.", how: "Pick closest category. Revenue auto-uses Service Revenue." },
      { name: "Amount ($)", where: "Lists and charts.", what: "Dollar value.", how: "Must be > $0. Decimals OK.", example: "45.99" },
      { name: "Date", where: "Transaction table.", what: "When money changed hands.", how: "Use actual payment date." },
      { name: "Description", where: "Transaction table main text.", what: "Short memorable label.", how: "Required. Be specific.", example: "Monthly plan — Smith residence" },
      { name: "Vendor (optional)", where: "Gray text under description (expenses only).", what: "Who you paid.", how: "Store or supplier name.", example: "Home Depot" },
    ],
  },
  {
    id: "tips",
    title: "Common Mistakes",
    bullets: [
      { title: "Forgetting to Save Section", description: "Site Content changes are lost if you switch categories without clicking Save Section." },
      { title: "Wrong phone format", description: "Display phone ≠ tel link. Display: (555) 123-4567. Tel: +15551234567." },
      { title: "Broken navigation URLs", description: "URLs must start with / and match real pages. Test every link." },
      { title: "One-per-line fields", description: "Trust Indicators, Features, Included — each line is a separate bullet, not commas on one line." },
      { title: "Story paragraphs", description: "About → Story uses blank lines between paragraphs (Enter twice)." },
      { title: "ZIP codes", description: "5 digits, comma-separated. Numbers only." },
      { title: "State codes", description: "Always 2 letters: MO not Missouri." },
      { title: "Pending jobs", description: "Website bookings arrive as Pending — change to Scheduled when you confirm." },
    ],
  },
];

/** Maps Site Content section IDs to guide anchor IDs */
export const CONTENT_SECTION_GUIDE_IDS: Record<string, string> = {
  business: "business",
  navigation: "nav-links",
  layout: "layout",
  homepage: "homepage",
  pages: "pages",
  features: "features",
  howItWorksSteps: "howItWorksSteps",
  pricing: "pricing",
  services: "services",
  faq: "faq",
  testimonials: "testimonials",
  about: "about",
  serviceArea: "serviceArea",
  legal: "legal",
};
