import type { GuideField } from "@/lib/admin/guide-content";

type HelpEntry = GuideField & { key: string };

function h(
  key: string,
  name: string,
  where: string,
  what: string,
  how: string,
  example?: string,
  tip?: string
): HelpEntry {
  return { key, name, where, what, how, example, tip };
}

const ENTRIES: HelpEntry[] = [
  // ── Business Info ──
  h(
    "business.name",
    "Business Name",
    "Website header logo area, browser tab titles, footer copyright, and anywhere the full company name appears publicly.",
    "The official legal or brand name of your cleaning business — the name customers should recognize everywhere.",
    "Type the complete business name exactly how you want it displayed. Do not use abbreviations here unless that is your official brand.",
    "JHCleans.com",
    "This is the long form. Use Short Name for tight spaces like the mobile menu."
  ),
  h(
    "business.shortName",
    "Short Name",
    "Admin sidebar, compact mobile header, and anywhere space is limited.",
    "A shorter version of your business name for small UI areas.",
    "Use just the core brand word or acronym — no taglines or extra descriptors.",
    "JHCleans"
  ),
  h(
    "business.tagline",
    "Tagline",
    "Under the logo, in hero sections, and sometimes in the footer — a short catchy phrase.",
    "One memorable line that tells people what you do or why you're different.",
    "Keep it under about 8 words. No period at the end unless it is a full sentence. Make it punchy and easy to remember.",
    "Cleaner Cans. Fresher Homes."
  ),
  h(
    "business.description",
    "Description",
    "Search engine results (Google snippet), social media previews, and about-page summaries.",
    "A 1–2 sentence overview of your garbage-can cleaning service for people who have never heard of you.",
    "Write in complete sentences. Mention curbside service, cleaning/sanitizing/deodorizing, and who you serve (homeowners, etc.).",
    "Professional garbage-can cleaning, sanitizing, and deodorizing delivered right to your curb."
  ),
  h(
    "business.contact.phone",
    "Phone",
    "Contact page, website footer, and any 'Call us' text that visitors read before tapping.",
    "The phone number displayed to humans — formatted the way people normally read and dial it.",
    "Use dashes, parentheses, or spaces for readability. This is what appears on screen, NOT the click-to-call link.",
    "(555) 123-4567",
    "Must match the number customers expect. Different from Phone (tel link) below."
  ),
  h(
    "business.contact.phoneTel",
    "Phone (tel link)",
    "Hidden behind mobile 'Call' buttons — when someone taps to call, the phone uses THIS value.",
    "A machine-readable phone number for click-to-call links on smartphones.",
    "Digits only, starting with country code: +1 then area code and number. No spaces, dashes, or parentheses.",
    "+15551234567",
    "If this is empty, tap-to-call buttons may not work on iPhone and Android."
  ),
  h(
    "business.contact.email",
    "Email",
    "Contact page, footer mailto links, and form confirmation references.",
    "The business email address where customer inquiries should go.",
    "Use a real inbox checked daily. Avoid personal emails if possible — use hello@ or contact@ your domain.",
    "hello@jhcleans.com"
  ),
  h(
    "business.contact.address.display",
    "Address Display",
    "Contact page — the full address line visitors read.",
    "How you want your location or service area written out for the public.",
    "You can show a city/region without a street address if you operate mobile/curbside and don't want a home address public.",
    "Serving the Greater Springfield Area"
  ),
  h(
    "business.contact.address.city",
    "City",
    "Structured address data used internally and in maps.",
    "Your primary service city or business city.",
    "City name only — no state, no ZIP, no comma.",
    "Springfield"
  ),
  h(
    "business.contact.address.state",
    "State",
    "Structured address alongside city.",
    "Two-letter US state abbreviation.",
    "Exactly 2 capital letters. Not the full state name.",
    "MO",
    "Job forms and addresses also require 2-letter codes like MO, not Missouri."
  ),
  h(
    "business.hours.weekdays",
    "Weekday Hours",
    "Contact page Business Hours section — the Monday–Friday line.",
    "When you answer calls or perform service on weekdays.",
    "Write the day range and times in plain English that anyone can understand.",
    "Monday – Friday: 8 AM – 6 PM"
  ),
  h(
    "business.hours.saturday",
    "Saturday Hours",
    "Contact page Business Hours — Saturday line.",
    "Your Saturday availability.",
    "Write times or the word Closed if you do not work Saturdays.",
    "Saturday: 9 AM – 2 PM"
  ),
  h(
    "business.hours.sunday",
    "Sunday Hours",
    "Contact page Business Hours — Sunday line.",
    "Your Sunday availability.",
    "Most businesses write Closed here.",
    "Sunday: Closed"
  ),
  h(
    "business.hours.note",
    "Hours Note",
    "Small helper text below the hours list on the Contact page.",
    "Extra info about when people can reach you or book online.",
    "Mention if online booking works 24/7 even when phone lines are closed.",
    "Online booking available 24/7"
  ),
  h(
    "business.social.facebook",
    "Facebook URL",
    "Footer social icons — the Facebook icon only appears if this field has a value.",
    "Full link to your Facebook business page.",
    "Paste the complete https:// URL. Leave completely blank to hide the icon.",
    "https://facebook.com/jhcleans"
  ),
  h(
    "business.social.instagram",
    "Instagram URL",
    "Footer Instagram icon.",
    "Full link to your Instagram profile.",
    "Paste https://instagram.com/yourhandle or leave blank to hide.",
    "https://instagram.com/jhcleans"
  ),
  h(
    "business.social.tiktok",
    "TikTok URL",
    "Footer TikTok icon.",
    "Full link to your TikTok profile.",
    "Paste full URL or leave blank.",
    "https://tiktok.com/@jhcleans"
  ),
  h(
    "business.social.yelp",
    "Yelp URL",
    "Footer Yelp icon.",
    "Your Yelp business listing URL.",
    "Paste full URL or leave blank.",
    "https://yelp.com/biz/jhcleans"
  ),
  h(
    "business.social.google",
    "Google URL",
    "Footer Google icon — usually links to reviews or Google Business Profile.",
    "Google Business Profile, Maps, or review link.",
    "Paste full URL or leave blank.",
    "https://g.page/jhcleans"
  ),
  h(
    "business.claims.satisfactionGuarantee",
    "Satisfaction Guarantee",
    "Homepage trust badges and marketing copy about your service promise.",
    "Your written guarantee if a customer is unhappy with a cleaning.",
    "Write 1–3 honest sentences. Only promise what you can actually deliver and honor.",
    "If you are not satisfied with your cleaning, contact us within 48 hours and we will make it right."
  ),

  // ── Navigation ──
  h(
    "navigation.label",
    "Label",
    "Top navigation bar on every public page — the clickable menu text.",
    "The word or short phrase visitors see in the header menu.",
    "Keep it 1–3 words. Order in this list = left-to-right order in the header.",
    "Pricing",
    "Use Add Item for new links. Remove deletes a menu item."
  ),
  h(
    "navigation.href",
    "URL",
    "Where the menu link goes when a visitor clicks it.",
    "The page path or homepage anchor on your website.",
    "Start with / for internal pages (e.g. /services). Use /#faq to jump to a section on the homepage. Test every link after saving.",
    "/pricing  or  /#how-it-works",
    "Broken URLs send visitors to error pages and hurt SEO."
  ),

  // ── Layout / CTAs ──
  h(
    "layout.headerCta",
    "Header CTA",
    "Top-right green button on the desktop website header.",
    "The main action button always visible in navigation — usually booking.",
    "Short action phrase, 2–3 words max. Should match your primary business goal.",
    "Book Now"
  ),
  h(
    "layout.mobileQuoteCta",
    "Mobile Quote CTA",
    "Sticky bar fixed to the bottom of phone screens — left button.",
    "Secondary action for visitors who want pricing before booking.",
    "Short label, 2–3 words.",
    "Get Quote"
  ),
  h(
    "layout.mobileBookCta",
    "Mobile Book CTA",
    "Sticky bottom bar on phones — right (primary) button.",
    "Main booking action on mobile where thumb reaches easily.",
    "Short label, usually matches Header CTA.",
    "Book Now"
  ),
  h(
    "layout.footerBookLabel",
    "Footer Book Label",
    "Footer link text pointing to the booking page.",
    "Text for the book/clean link in the website footer.",
    "Can match Header CTA or be slightly more descriptive.",
    "Book Now"
  ),

  // ── Homepage Hero ──
  h(
    "homepage.hero.badge",
    "Badge",
    "Small pill/tag above the main homepage headline.",
    "A short label highlighting your service category.",
    "3–6 words. Think of it as a category tag, not a full sentence.",
    "Professional Curbside Service"
  ),
  h(
    "homepage.hero.headline",
    "Headline",
    "Large main text — first line of the homepage hero.",
    "Primary headline stating what you do.",
    "Can end with a comma if the accent line below completes the sentence.",
    "Professional Garbage Can Cleaning,"
  ),
  h(
    "homepage.hero.headlineAccent",
    "Headline Accent",
    "Second headline line, usually shown in a bright accent color.",
    "The emphasized words that complete or punch up the headline.",
    "Should flow naturally after the Headline line.",
    "Sanitizing & Deodorizing"
  ),
  h(
    "homepage.hero.primaryCta",
    "Primary CTA",
    "Big green button in the homepage hero section.",
    "Main button text — the #1 action you want visitors to take.",
    "Action-oriented, 2–4 words.",
    "Book a Cleaning"
  ),
  h(
    "homepage.hero.secondaryCta",
    "Secondary CTA",
    "Outline/ghost button next to the primary hero button.",
    "Alternative action for visitors not ready to book yet.",
    "Often Get a Quote, Learn More, or See Pricing.",
    "Get a Free Quote"
  ),
  h(
    "homepage.hero.trustIndicators",
    "Trust Indicators (one per line)",
    "Small bullet/check items displayed under the hero buttons.",
    "Quick trust-building points — each line becomes its own bullet with a checkmark.",
    "Press Enter after each line to start a new bullet. Do NOT put multiple items on one line separated by commas.",
    "Convenient curbside service\nFamily-focused local business\nSatisfaction-focused service"
  ),

  // ── Homepage Section Headings ──
  h(
    "homepage.sections.howItWorks.title",
    "How It Works Title",
    "Large heading above the 4-step process icons on the homepage.",
    "Section title for the how-it-works block.",
    "Clear, simple title.",
    "How It Works"
  ),
  h(
    "homepage.sections.howItWorks.subtitle",
    "How It Works Subtitle",
    "Gray subtext under the How It Works title.",
    "One line explaining the steps below.",
    "Keep it friendly and brief.",
    "Four simple steps to cleaner, fresher bins"
  ),
  h(
    "homepage.sections.pricing.title",
    "Pricing Title",
    "Heading above the homepage pricing preview cards.",
    "Pricing section title on the homepage.",
    "Emphasize simplicity or transparency if that's your brand.",
    "Simple, Transparent Pricing"
  ),
  h(
    "homepage.sections.pricing.subtitle",
    "Pricing Subtitle",
    "Gray text under the homepage pricing title.",
    "Supporting line for pricing preview.",
    "Can mention plans or that final pricing is coming.",
    "Choose the plan that fits your home."
  ),
  h(
    "homepage.sections.testimonials.title",
    "Testimonials Title",
    "Heading above customer quote cards on the homepage.",
    "Title for the testimonials section.",
    "Short and social-proof oriented.",
    "What Our Customers Say"
  ),
  h(
    "homepage.sections.faq.title",
    "FAQ Title",
    "Heading above the FAQ accordion on the homepage.",
    "Title for frequently asked questions.",
    "Standard FAQ heading works fine.",
    "Frequently Asked Questions"
  ),
  h(
    "homepage.sections.serviceArea.title",
    "Service Area Title",
    "Heading above the ZIP code checker on the homepage.",
    "Title inviting visitors to check if you serve them.",
    "Clear and location-focused.",
    "Service Area"
  ),
  h(
    "homepage.sections.serviceArea.subtitle",
    "Service Area Subtitle",
    "Gray text under the service area title.",
    "Encourages ZIP code lookup.",
    "Tell them to enter their ZIP.",
    "Check if we service your ZIP code."
  ),

  // ── Homepage Final CTA ──
  h(
    "homepage.finalCta.title",
    "Title",
    "Large text in the bottom call-to-action band before the footer.",
    "Closing headline pushing visitors to act now.",
    "Motivational question or statement.",
    "Ready for Cleaner, Fresher Cans?"
  ),
  h(
    "homepage.finalCta.body",
    "Body",
    "Paragraph under the final CTA title.",
    "Extra sentence reinforcing why they should book now.",
    "1–2 sentences max.",
    "Book your first cleaning today and take one unpleasant household job off your list."
  ),
  h(
    "homepage.finalCta.primaryCta",
    "Primary CTA",
    "Green button in the bottom CTA band.",
    "Main book button label.",
    "Match hero primary CTA for consistency.",
    "Book a Cleaning"
  ),
  h(
    "homepage.finalCta.secondaryCta",
    "Secondary CTA",
    "Second button in the bottom CTA band.",
    "Alternative quote/contact action.",
    "Short label.",
    "Request a Quote"
  ),

  // ── Homepage Pricing Preview ──
  h(
    "homepage.pricingPreview.name",
    "Name",
    "Bold plan name on each homepage pricing preview card.",
    "Short plan title.",
    "Keep it recognizable — One-Time, Monthly, Multi-Bin, etc.",
    "Monthly Plan"
  ),
  h(
    "homepage.pricingPreview.price",
    "Price",
    "Large price display on the preview card.",
    "The price visitors see at a glance.",
    "Include the $ sign. Can be a starting price.",
    "$25"
  ),
  h(
    "homepage.pricingPreview.description",
    "Description",
    "Gray text under the plan name on the preview card.",
    "One-line summary of who the plan is for.",
    "Brief and benefit-focused.",
    "Keep your bins fresh all month."
  ),
  h(
    "homepage.pricingPreview.note",
    "Note",
    "Small text under the price on the preview card.",
    "Billing frequency or per-unit clarification.",
    "Clarify per-bin pricing or billing cycle.",
    "per bin · Billed monthly"
  ),

  // ── Page Headings ──
  h(
    "pages.services.title",
    "Services Title",
    "Large heading at the top of the /services page.",
    "Main title for the services page.",
    "Clear page title.",
    "Our Services"
  ),
  h(
    "pages.services.subtitle",
    "Services Subtitle",
    "Gray text under the services page title.",
    "Longer explanation of what you offer.",
    "1–2 sentences describing curbside bin cleaning for your audience.",
    "Professional curbside garbage can cleaning, sanitizing, and deodorizing for residential customers."
  ),
  h(
    "pages.services.ctaLabel",
    "Services CTA Label",
    "Text on the 'book this service' button on each service card.",
    "Action button label on service cards.",
    "Short action phrase.",
    "Book This Service"
  ),
  h(
    "pages.contact.title",
    "Contact Title",
    "Large heading at the top of /contact.",
    "Contact page main heading.",
    "Welcoming and open.",
    "Contact Us"
  ),
  h(
    "pages.contact.subtitle",
    "Contact Subtitle",
    "Gray text under contact title.",
    "Invite people to reach out.",
    "Friendly one-liner.",
    "Have a question or need a quote? We're here to help."
  ),
  h(
    "pages.book.title",
    "Book Title",
    "Large heading at the top of /book above the booking form.",
    "Tells visitors they are requesting a cleaning.",
    "Action-oriented title.",
    "Book a Cleaning"
  ),
  h(
    "pages.book.subtitle",
    "Book Subtitle",
    "Gray instructions above the booking form fields.",
    "Brief instruction before they fill out the form.",
    "Tell them to complete the form below.",
    "Complete the form below to request your curbside bin cleaning service."
  ),
  h(
    "pages.pricing.quoteTitle",
    "Pricing Quote Title",
    "Callout box heading on the /pricing page for custom quotes.",
    "Headline for the custom quote section.",
    "Question format works well.",
    "Need a Custom Quote?"
  ),
  h(
    "pages.pricing.quoteSubtitle",
    "Pricing Quote Subtitle",
    "Text under the quote title on /pricing.",
    "Encourages filling out a quote form.",
    "Tell them what to do next.",
    "Tell us about your bins and we'll send pricing details."
  ),

  // ── Features ──
  h(
    "features.title",
    "Title",
    "Bold text on each feature card in the homepage grid.",
    "Name of this benefit or feature.",
    "2–4 words.",
    "Deep Cleaning"
  ),
  h(
    "features.icon",
    "Icon",
    "Small icon displayed above the feature title.",
    "Icon keyword — the website picks a matching Lucide icon.",
    "Use lowercase: sparkles, wind, shield, truck, calendar, refresh-cw, droplets, map-pin, leaf, smile. Wrong name = missing icon.",
    "sparkles"
  ),
  h(
    "features.description",
    "Description",
    "Gray paragraph on the feature card.",
    "Explain this benefit in plain language.",
    "1–2 sentences.",
    "High-pressure washing removes grime, residue, and buildup from inside and out."
  ),

  // ── How It Works Steps ──
  h(
    "howItWorksSteps.title",
    "Title",
    "Step name displayed under the step number circle.",
    "What happens in this step of your process.",
    "Short verb phrase — Book Online, We Clean, etc.",
    "Book Online"
  ),
  h(
    "howItWorksSteps.step",
    "Step Number",
    "The big number in the circle (1, 2, 3, 4).",
    "Order of this step in the process.",
    "Use whole numbers 1, 2, 3, 4 in sequence. Don't skip numbers.",
    "1"
  ),
  h(
    "howItWorksSteps.description",
    "Description",
    "Explanation text under the step title.",
    "Details about what the customer does or what you do.",
    "1–2 sentences.",
    "Choose your service, pick a date, and tell us how many bins need cleaning."
  ),

  // ── Pricing Plans ──
  h(
    "pricing.recurringSavingsLabel",
    "Recurring Savings Label",
    "Badge or label on recurring plan cards showing savings vs one-time.",
    "Text displayed next to the savings percentage.",
    "Short phrase about recurring plan savings.",
    "Save with recurring plans"
  ),
  h(
    "pricing.savingsPercent",
    "Savings Percent",
    "Numeric badge like 'Save 20%' on recurring plans.",
    "How much cheaper recurring plans are compared to one-time.",
    "Enter a number only — no % symbol. Leave empty if you don't know yet.",
    "20"
  ),
  h(
    "pricing.plans.name",
    "Name",
    "Bold plan name on each full pricing card on /pricing.",
    "Plan title customers choose between.",
    "One-Time Clean, Monthly Plan, Multi-Bin Plan, etc.",
    "Monthly Plan"
  ),
  h(
    "pricing.plans.priceLabel",
    "Price Label",
    "Large price shown on the pricing card.",
    "Displayed price with optional 'From' prefix.",
    "Include $ sign.",
    "$25 or From $22"
  ),
  h(
    "pricing.plans.description",
    "Description",
    "Text under the plan name on the pricing card.",
    "Who this plan is best for.",
    "One short sentence.",
    "Perfect for a fresh start."
  ),
  h(
    "pricing.plans.priceNote",
    "Price Note",
    "Small text under the price.",
    "Per-bin, billing cycle, or minimum clarification.",
    "Be specific about units and billing.",
    "per bin · Billed monthly"
  ),
  h(
    "pricing.plans.ctaLabel",
    "CTA Label",
    "Button text on the pricing card.",
    "What the plan button says.",
    "Usually Book Now or Get Started.",
    "Book Now"
  ),
  h(
    "pricing.plans.ctaHref",
    "CTA Link",
    "Where the pricing card button links to.",
    "Destination URL when they click the plan button.",
    "Usually /book. Can be /contact for quote-first plans.",
    "/book"
  ),
  h(
    "pricing.plans.features",
    "Features (one per line)",
    "Checkmark bullet list on each pricing card.",
    "What's included in this plan — one item per line.",
    "Press Enter between each feature. Each line becomes a checkmark bullet. Do not use commas on one line.",
    "Exterior & interior cleaning\nSanitizing treatment\nDeodorizing"
  ),

  // ── Services ──
  h(
    "services.name",
    "Name",
    "Service card heading on /services.",
    "Name of this service offering.",
    "Clear service name.",
    "Residential Bin Cleaning"
  ),
  h(
    "services.priceLabel",
    "Price Label",
    "Price shown on the service card.",
    "Starting price or price range.",
    "Can use 'From $X' format.",
    "From $35/bin"
  ),
  h(
    "services.description",
    "Description",
    "Main paragraph on the service card.",
    "High-level description of this service.",
    "2–3 sentences max.",
    "Full curbside deep clean of your garbage and recycling bins."
  ),
  h(
    "services.duration",
    "Duration",
    "Small time badge on the service card.",
    "How long the service typically takes.",
    "Short estimate.",
    "~15 min per bin"
  ),
  h(
    "services.href",
    "Booking Link",
    "Where the service card Book button goes.",
    "URL for booking this service.",
    "Usually /book.",
    "/book"
  ),
  h(
    "services.included",
    "Included (one per line)",
    "Bullet list of what's included in this service.",
    "Each included item — one per line.",
    "Press Enter between items. Each becomes a bullet.",
    "Pressure wash interior & exterior\nEco-friendly sanitizing\nDeodorizing treatment"
  ),

  // ── FAQ ──
  h(
    "faq.question",
    "Question",
    "Bold clickable row in the FAQ accordion.",
    "A question customers commonly ask.",
    "Write as a real question ending with a question mark.",
    "Do I need to be home during the cleaning?"
  ),
  h(
    "faq.answer",
    "Answer",
    "Hidden text that expands when the question is clicked.",
    "Your clear, honest answer.",
    "2–5 sentences in plain language. Answer completely so they don't need to call.",
    "No. As long as your bins are accessible at the agreed location, you do not need to be home."
  ),

  // ── Testimonials ──
  h(
    "testimonials.quote",
    "Quote",
    "Large quote text in the testimonials section.",
    "What the customer said about your service.",
    "1–3 sentences in first person. Only use real reviews you have permission to publish.",
    "Our bins have never smelled this good!"
  ),
  h(
    "testimonials.author",
    "Author",
    "Name displayed under the quote.",
    "Customer name.",
    "First name + last initial or full name.",
    "Sarah M."
  ),
  h(
    "testimonials.location",
    "Location",
    "City or neighborhood under the author name.",
    "Where the customer is from.",
    "City, state or neighborhood.",
    "Springfield, MO"
  ),

  // ── About ──
  h(
    "about.headline",
    "Headline",
    "Large title at the top of the /about page.",
    "Main about page headline about your story.",
    "Welcoming and authentic.",
    "Built by Neighbors, for Neighbors"
  ),
  h(
    "about.story",
    "Story (one paragraph per line)",
    "Body paragraphs on the about page telling your origin story.",
    "Your founding story, mission, and why you started.",
    "Separate paragraphs with a BLANK LINE (press Enter twice). Single Enter keeps text in the same paragraph.",
    "Paragraph one about how you started...\n\nParagraph two about your values..."
  ),
  h(
    "about.foundersNote",
    "Founders Note",
    "Signed personal note from the founders on the about page.",
    "Closing message from the team.",
    "Short sign-off.",
    "— The JHCleans Team"
  ),
  h(
    "about.values.title",
    "Title",
    "Value name on each principle card on the about page.",
    "Name of a core value or principle.",
    "One word or short phrase.",
    "Quality"
  ),
  h(
    "about.values.description",
    "Description",
    "Explanation under each value title.",
    "What this value means to your business.",
    "1–2 sentences.",
    "We never cut corners on a clean."
  ),

  // ── Service Area ──
  h(
    "serviceArea.regionLabel",
    "Region Label",
    "Heading above the list of featured cities.",
    "Name of your geographic service region.",
    "Name the area you serve.",
    "Greater Springfield Area"
  ),
  h(
    "serviceArea.mapNote",
    "Map Note",
    "Helper text near the map or ZIP code tool.",
    "Extra geography or expansion info.",
    "Mention contacting you if ZIP isn't listed.",
    "Don't see your ZIP? Contact us — we may still be able to help."
  ),
  h(
    "serviceArea.servicedZipCodes",
    "Serviced ZIP Codes (comma separated)",
    "ZIPs that show a green 'Yes, we serve your area!' message in the checker.",
    "ZIP codes where you definitely provide service.",
    "5-digit US ZIP codes separated by commas. Spaces after commas are OK. Numbers only — no 'ZIP' label.",
    "65801, 65802, 65803",
    "Wrong or missing ZIPs mean customers think you don't serve them and leave."
  ),
  h(
    "serviceArea.maybeZipCodes",
    "Maybe ZIP Codes (comma separated)",
    "ZIPs that show a yellow 'maybe' message — you might serve with extra fee or on request.",
    "Borderline areas or places you're expanding into.",
    "Same comma-separated 5-digit format as serviced ZIPs.",
    "65804, 65810"
  ),
  h(
    "serviceArea.featuredCity.name",
    "City",
    "Featured cities list — city name shown on the homepage.",
    "City you want to highlight as served.",
    "City name only.",
    "Springfield"
  ),
  h(
    "serviceArea.featuredCity.state",
    "State",
    "Featured cities — state abbreviation.",
    "2-letter state for the featured city.",
    "MO, IL, etc.",
    "MO"
  ),

  // ── Legal ──
  h(
    "legal.lastUpdated",
    "Last Updated",
    "Top of each legal page (Privacy, Terms, etc.).",
    "Date the policy was last revised.",
    "Human-readable date. Update whenever you change legal text.",
    "March 15, 2026",
    "Have a lawyer review all legal content before launch."
  ),
  h(
    "legal.sectionTitle",
    "Section Title",
    "Bold heading within a legal page.",
    "Topic of this legal section.",
    "Clear section name like Information We Collect.",
    "Information We Collect"
  ),
  h(
    "legal.sectionContent",
    "Section Content",
    "Paragraph(s) under each legal section title.",
    "The actual legal policy text.",
    "Complete sentences. Use Add Item for new sections. Replace all [UPDATE...] placeholders before launch.",
    "We may collect personal information you provide through our website forms..."
  ),

  // ── Calendar / Jobs ──
  h(
    "job.title",
    "Job Title",
    "Colored block on the calendar and in job lists on the Dashboard.",
    "Short name so you recognize this job at a glance.",
    "Use customer name + service type or frequency. Required field.",
    "Smith Residence — Monthly"
  ),
  h(
    "job.customerName",
    "Customer Name",
    "Job record — also pulled from website bookings automatically.",
    "Full name of the person who booked.",
    "First and last name. Required.",
    "John Smith"
  ),
  h(
    "job.customerPhone",
    "Phone",
    "Job record for calling or texting the customer.",
    "Customer phone number.",
    "At least 10 digits. Required.",
    "555-123-4567"
  ),
  h(
    "job.customerEmail",
    "Email",
    "Job record for confirmations.",
    "Customer email address.",
    "Must be valid email format. Required.",
    "john@email.com"
  ),
  h(
    "job.address",
    "Street Address",
    "Where the bins are located for this job.",
    "House number and street.",
    "Full street address. Required.",
    "123 Oak Street"
  ),
  h(
    "job.city",
    "City",
    "Job location city.",
    "City where bins are located.",
    "Required.",
    "Springfield"
  ),
  h(
    "job.state",
    "State",
    "Job location state.",
    "Two-letter US state code only.",
    "Exactly 2 letters like MO — not full state name. Required.",
    "MO"
  ),
  h(
    "job.zipCode",
    "ZIP Code",
    "Job location ZIP for routing and service area checks.",
    "US ZIP code.",
    "5 digits or 5+4 format (65801 or 65801-1234). Required.",
    "65801"
  ),
  h(
    "job.serviceType",
    "Service Type",
    "Dropdown on the job form.",
    "Billing frequency: One-Time, Monthly, Bi-Weekly, or Multi-Can.",
    "Pick the plan type the customer signed up for.",
    "Monthly"
  ),
  h(
    "job.garbageCanCount",
    "Garbage Cans",
    "Number input on job form.",
    "How many trash/garbage bins to clean.",
    "Whole number 0–20. Usually at least 1.",
    "2"
  ),
  h(
    "job.recyclingCanCount",
    "Recycling Cans",
    "Number input on job form.",
    "How many recycling bins to clean.",
    "Whole number 0–20. Use 0 if none.",
    "1"
  ),
  h(
    "job.timeWindow",
    "Time Window",
    "Dropdown — Morning, Afternoon, or Flexible.",
    "Customer's preferred arrival window (not exact clock time).",
    "Pick what the customer requested when they booked.",
    "Morning (8 AM – 12 PM)"
  ),
  h(
    "job.status",
    "Status",
    "Dropdown and quick-status buttons on the job form.",
    "Where this job is in your workflow: Pending → Scheduled → In Progress → Completed (or Cancelled).",
    "Pending = new website booking. Scheduled = confirmed. Completed = done. Cancelled = won't happen.",
    "Scheduled"
  ),
  h(
    "job.scheduledStart",
    "Start",
    "Datetime picker — when the calendar block begins.",
    "Scheduled start date and time for the cleaning.",
    "Click to pick date and time. Required. Must be before End.",
    "2026-07-15 09:00"
  ),
  h(
    "job.scheduledEnd",
    "End",
    "Datetime picker — when the calendar block ends.",
    "Scheduled end time (usually ~1 hour after start).",
    "Must be after Start. Required.",
    "2026-07-15 10:00"
  ),
  h(
    "job.revenue",
    "Revenue ($)",
    "Job form field — for your reference on this job.",
    "Dollar amount you expect to earn from this cleaning.",
    "Numbers only, cents OK. Use 0 if not priced yet.",
    "75.00",
    "This does NOT auto-add to Finances — add a revenue transaction separately for reports."
  ),
  h(
    "job.notes",
    "Notes",
    "Internal job notes — never shown to customers on the public website.",
    "Gate codes, dog warnings, bin location, access instructions.",
    "Optional, max 500 characters.",
    "Blue house, bins on left side of driveway. Gate code 4521."
  ),

  // ── Finances / Transactions ──
  h(
    "transaction.type",
    "Type",
    "Revenue or Expense dropdown in the transaction form.",
    "Whether money came in (Revenue) or went out (Expense).",
    "Revenue when a customer pays you. Expense when you buy something for the business.",
    "Revenue"
  ),
  h(
    "transaction.category",
    "Category",
    "Expense category dropdown (hidden for Revenue).",
    "What kind of expense: supplies, equipment, fuel, marketing, insurance, or other.",
    "Pick the closest category. Revenue automatically uses Service Revenue.",
    "Cleaning Supplies"
  ),
  h(
    "transaction.amount",
    "Amount ($)",
    "Dollar value shown in transaction lists and profit charts.",
    "How much money in or out.",
    "Must be greater than $0. Decimals OK for cents.",
    "45.99"
  ),
  h(
    "transaction.date",
    "Date",
    "When the transaction appears in reports and charts.",
    "The date the money actually changed hands.",
    "Use the real payment or purchase date, not today unless that's correct.",
    "2026-07-02"
  ),
  h(
    "transaction.description",
    "Description",
    "Main text in the transaction table.",
    "Short label so you remember what this entry was.",
    "Required. Be specific — include customer or job if revenue.",
    "Monthly plan — Smith residence"
  ),
  h(
    "transaction.vendor",
    "Vendor (optional)",
    "Small gray text under description — expenses only.",
    "Store or supplier you paid.",
    "Optional but helpful for taxes and tracking.",
    "Home Depot"
  ),
];

export const FIELD_HELP: Record<string, GuideField> = Object.fromEntries(
  ENTRIES.map(({ key, ...field }) => [key, field])
);

export function getFieldHelp(key: string): GuideField | undefined {
  return FIELD_HELP[key];
}

export function formatFieldHelpForConsultant(): string {
  return ENTRIES.map(
    (e) =>
      `[${e.key}] ${e.name}\n  Shows on: ${e.where}\n  Purpose: ${e.what}\n  How: ${e.how}${e.example ? `\n  Example: ${e.example}` : ""}${e.tip ? `\n  Tip: ${e.tip}` : ""}`
  ).join("\n\n");
}
