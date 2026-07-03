#!/usr/bin/env python3
"""Generate the JHCleans Admin Portal user guide PDF."""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    HRFlowable,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

OUTPUT = Path(__file__).resolve().parent.parent / "docs" / "JHCleans-Admin-Guide.pdf"


def field(title, where, what, how, example=None, tip=None):
    parts = [
        f"<b>{title}</b>",
        f"<i>Where you see it on the website:</i> {where}",
        f"<i>What it is:</i> {what}",
        f"<i>How to fill it out:</i> {how}",
    ]
    if example:
        parts.append(f"<i>Example:</i> {example}")
    if tip:
        parts.append(f"<i>Tip:</i> {tip}")
    return "<br/>".join(parts)


def build_story(styles):
    story = []
    h1 = styles["H1"]
    h2 = styles["H2"]
    h3 = styles["H3"]
    body = styles["Body"]
    note = styles["Note"]

    # Cover
    story.append(Spacer(1, 1.5 * inch))
    story.append(Paragraph("JHCleans Admin Portal", h1))
    story.append(Paragraph("Complete Field-by-Field Guide", h2))
    story.append(Spacer(1, 0.3 * inch))
    story.append(
        Paragraph(
            "This guide walks through every section of the admin portal in order. "
            "Each input is explained in plain language so anyone can update the website, "
            "manage jobs, and track finances without guessing.",
            body,
        )
    )
    story.append(Spacer(1, 0.2 * inch))
    story.append(
        Paragraph(
            "<b>How to use this guide:</b> Work top to bottom. The sidebar menu order matches "
            "the chapters here. Within <b>Site Content</b>, use the left panel of category buttons "
            "in the same order listed in Chapter 4.",
            note,
        )
    )
    story.append(PageBreak())

    # TOC
    story.append(Paragraph("Table of Contents", h1))
    toc = [
        "1. Before You Start — Logging In",
        "2. Admin Sidebar Navigation",
        "3. Dashboard (Overview — No Editable Fields)",
        "4. Site Content — All Categories in Order",
        "   4.1  Business Info",
        "   4.2  Navigation",
        "   4.3  Buttons &amp; CTAs",
        "   4.4  Homepage",
        "   4.5  Page Headings",
        "   4.6  Features",
        "   4.7  How It Works",
        "   4.8  Pricing Plans",
        "   4.9  Services",
        "   4.10 FAQ",
        "   4.11 Testimonials",
        "   4.12 About",
        "   4.13 Service Area",
        "   4.14 Legal Pages",
        "5. Calendar — Job Form Fields",
        "6. Finances — Transaction Form Fields",
        "7. Saving, Resetting &amp; Common Mistakes",
    ]
    for line in toc:
        story.append(Paragraph(line, body))
        story.append(Spacer(1, 4))
    story.append(PageBreak())

    # Chapter 1
    story.append(Paragraph("1. Before You Start — Logging In", h1))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#00d2ff")))
    story.append(Spacer(1, 12))
    story.append(
        Paragraph(
            "<b>URL:</b> Go to <i>/admin/login</i> on your website (example: "
            "<i>https://jhcleans.com/admin/login</i>).",
            body,
        )
    )
    story.append(Spacer(1, 8))
    story.append(
        Paragraph(
            field(
                "Password",
                "The login screen — a single box with a lock icon, centered on a dark card.",
                "The secret word that unlocks the admin area. There is no username — only a password.",
                "Type the admin password exactly as it was set. It is case-sensitive (capital letters matter). "
                "Click <b>Sign In</b>. If it fails, the box turns red with an error message.",
                "Your password is stored in an environment variable called ADMIN_PASSWORD on the server.",
                "If you forget the password, someone with server access must update ADMIN_PASSWORD and restart the site.",
            ),
            body,
        )
    )
    story.append(PageBreak())

    # Chapter 2
    story.append(Paragraph("2. Admin Sidebar Navigation", h1))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#00d2ff")))
    story.append(Spacer(1, 12))
    story.append(
        Paragraph(
            "After login, a dark sidebar on the left (or a slide-out menu on phones) shows four main areas. "
            "The highlighted item is the page you are on.",
            body,
        )
    )
    nav_data = [
        ["Menu Item", "What It Does", "Has Form Fields?"],
        ["Dashboard", "Quick stats, new booking requests, upcoming jobs, recent money entries", "No — view only"],
        ["Site Content", "Edit all website text, pricing, FAQs, legal pages, etc.", "Yes — main content editor"],
        ["Calendar", "See jobs on a calendar; add, edit, drag to reschedule", "Yes — job form popup"],
        ["Finances", "Charts and list of revenue/expenses", "Yes — transaction popup"],
        ["Sign out", "Logs you out safely", "No"],
    ]
    t = Table(nav_data, colWidths=[1.3 * inch, 3.2 * inch, 1.5 * inch])
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0c1529")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#00d2ff")),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#334155")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#111827"), colors.HexColor("#1e293b")]),
            ]
        )
    )
    story.append(t)
    story.append(PageBreak())

    # Chapter 3
    story.append(Paragraph("3. Dashboard (Overview — No Editable Fields)", h1))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#00d2ff")))
    story.append(Spacer(1, 12))
    story.append(
        Paragraph(
            "The Dashboard is your home screen. You cannot type into anything here — you read it and click links "
            "to go manage things elsewhere.",
            body,
        )
    )
    dashboard_items = [
        ("Revenue (This Month)", "Green dollar card — total money earned this calendar month."),
        ("Expenses (This Month)", "Amber card — money spent on supplies, fuel, etc. this month."),
        ("Net Profit", "Revenue minus expenses. Green if positive, red if negative."),
        ("Pending Requests", "New bookings from the public website waiting for you to confirm. Click 'Manage in calendar'."),
        ("Jobs Today", "How many cleanings are scheduled for today."),
        ("Upcoming Jobs", "Future scheduled jobs (not cancelled or completed)."),
        ("Completed Jobs", "Total finished jobs in the system."),
        ("New Cleaning Requests list", "Shows customer name, job title, date submitted, and booking reference. Orange 'Pending' badge."),
        ("Upcoming Jobs list", "Next 5 jobs with date/time. Click 'View all' → Calendar."),
        ("Recent Transactions list", "Last 5 money entries. Green + for revenue, amber - for expenses."),
    ]
    for title, desc in dashboard_items:
        story.append(Paragraph(f"<b>{title}</b> — {desc}", body))
        story.append(Spacer(1, 6))
    story.append(PageBreak())

    # Chapter 4 intro
    story.append(Paragraph("4. Site Content — All Categories in Order", h1))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#00d2ff")))
    story.append(Spacer(1, 12))
    story.append(
        Paragraph(
            "Go to <b>Site Content</b> in the sidebar. On the left is a list of 14 categories. "
            "Click one, edit the fields on the right, then click <b>Save Section</b> at the bottom. "
            "<b>Reset to Defaults</b> throws away your edits for that category only and restores the original template.",
            body,
        )
    )
    story.append(Spacer(1, 8))
    story.append(
        Paragraph(
            "<b>Important:</b> Changes do not go live until you click Save Section. Switching categories "
            "without saving may lose unsaved work.",
            note,
        )
    )

    # 4.1 Business Info
    story.append(Spacer(1, 16))
    story.append(Paragraph("4.1 Business Info", h2))
    business_fields = [
        field(
            "Business Name",
            "Site header logo area, page titles, footer, and anywhere the full company name appears.",
            "The official name of the business.",
            "Type the full name customers should recognize.",
            "JHCleans.com",
        ),
        field(
            "Short Name",
            "Compact spots like the admin sidebar and mobile header.",
            "A shorter version of the business name.",
            "Use the brand name without extra words.",
            "JHCleans",
        ),
        field(
            "Tagline",
            "Under the logo or in hero sections — a short catchy phrase.",
            "One line that sums up what you do.",
            "Keep it under ~8 words. No period needed.",
            "Cleaner Cans. Fresher Homes.",
        ),
        field(
            "Description",
            "SEO meta description and 'about' snippets.",
            "A 1–2 sentence summary of your service.",
            "Write in complete sentences. Describe garbage-can cleaning at the curb.",
            "Professional garbage-can cleaning, sanitizing, and deodorizing delivered right to your curb.",
        ),
        field(
            "Phone",
            "Contact page, footer, and anywhere visitors see your phone number to call.",
            "The human-readable phone number.",
            "Format how people normally dial it, with dashes or parentheses.",
            "(555) 123-4567",
            "Must match what customers expect to dial — not the tel: link format.",
        ),
        field(
            "Phone (tel link)",
            "The actual link when someone taps 'Call' on mobile — invisible but important.",
            "A special phone format for click-to-call links.",
            "Use digits only with country code, no spaces: +1 then area code and number.",
            "+15551234567",
            "If empty, click-to-call buttons may not work on phones.",
        ),
        field(
            "Email",
            "Contact page and footer mailto links.",
            "The business email customers should write to.",
            "Use a real inbox someone checks daily.",
            "hello@jhcleans.com",
        ),
        field(
            "Address Display",
            "Contact page — the full address line visitors read.",
            "How you want the address written out.",
            "City and state is fine if you do not want a street address public.",
            "Serving the Greater Springfield Area",
        ),
        field(
            "City",
            "Structured address data used in maps and forms.",
            "Your primary service city.",
            "City name only, no state.",
            "Springfield",
        ),
        field(
            "State",
            "Structured address — two-letter US state code.",
            "The state abbreviation.",
            "Exactly 2 capital letters.",
            "MO",
        ),
        field(
            "Weekday Hours",
            "Contact page 'Business Hours' box — Monday through Friday line.",
            "When you answer calls or do service on weekdays.",
            "Write the day range and times in plain English.",
            "Monday – Friday: 8 AM – 6 PM",
        ),
        field(
            "Saturday Hours",
            "Same hours box — Saturday line.",
            "Saturday availability.",
            "Write 'Closed' if you do not work Saturdays.",
            "Saturday: 9 AM – 2 PM",
        ),
        field(
            "Sunday Hours",
            "Same hours box — Sunday line.",
            "Sunday availability.",
            "Most businesses put 'Closed' here.",
            "Sunday: Closed",
        ),
        field(
            "Hours Note",
            "Small text under the hours list on Contact page.",
            "Extra info about when people can reach you.",
            "Mention online booking if forms work 24/7.",
            "Online booking available 24/7",
        ),
        field(
            "Facebook URL",
            "Footer social icons — Facebook icon only shows if this is filled.",
            "Full link to your Facebook page.",
            "Paste the complete https:// URL. Leave blank to hide the icon.",
            "https://facebook.com/jhcleans",
        ),
        field(
            "Instagram URL",
            "Footer — Instagram icon.",
            "Full link to Instagram profile.",
            "Same as Facebook — full URL or leave empty.",
            "https://instagram.com/jhcleans",
        ),
        field(
            "TikTok URL",
            "Footer — TikTok icon.",
            "Full link to TikTok profile.",
            "Full URL or leave empty.",
            "",
        ),
        field(
            "Yelp URL",
            "Footer — Yelp icon.",
            "Your Yelp business page URL.",
            "Full URL or leave empty.",
            "",
        ),
        field(
            "Google URL",
            "Footer — Google review or business profile link.",
            "Google Business Profile or Maps link.",
            "Full URL or leave empty.",
            "",
        ),
        field(
            "Satisfaction Guarantee",
            "Trust badges and marketing copy on the homepage.",
            "Your promise if a customer is not happy.",
            "Write 1–3 sentences. Only claim what you can actually honor.",
            "If you are not satisfied with your cleaning, contact us within 48 hours and we will make it right.",
        ),
    ]
    for f in business_fields:
        story.append(Paragraph(f, body))
        story.append(Spacer(1, 10))

    # 4.2 Navigation
    story.append(Paragraph("4.2 Navigation", h2))
    story.append(
        Paragraph(
            "This section is a <b>list of menu links</b>. Each item has two fields. Use <b>Add Item</b> for new links "
            "and <b>Remove</b> to delete one. Order top-to-bottom = left-to-right in the website header.",
            body,
        )
    )
    story.append(Spacer(1, 8))
    story.append(
        Paragraph(
            field(
                "Label",
                "The top navigation bar on every public page — the clickable text.",
                "The word or phrase visitors see.",
                "Keep it short (1–3 words).",
                "Pricing",
            ),
            body,
        )
    )
    story.append(Spacer(1, 8))
    story.append(
        Paragraph(
            field(
                "URL",
                "Where the link goes when clicked.",
                "The page path or anchor on your site.",
                "Start with / for internal pages. Use /#faq to jump to a homepage section.",
                "/pricing  or  /#how-it-works",
                "Broken URLs = 404 error pages. Double-check spelling.",
            ),
            body,
        )
    )

    # 4.3 Layout
    story.append(Paragraph("4.3 Buttons &amp; CTAs", h2))
    story.append(
        Paragraph(
            "CTA = 'Call To Action' — the buttons that push visitors to book or get a quote.",
            body,
        )
    )
    layout_fields = [
        field(
            "Header CTA",
            "Top-right green button on desktop header.",
            "Main action button in the navigation bar.",
            "Short action phrase, 2–3 words.",
            "Book Now",
        ),
        field(
            "Mobile Quote CTA",
            "Sticky bar at bottom of phone screens — left button.",
            "Secondary action for price questions on mobile.",
            "Short label.",
            "Get Quote",
        ),
        field(
            "Mobile Book CTA",
            "Sticky bar at bottom on mobile — right (primary) button.",
            "Main booking action on phones.",
            "Short label.",
            "Book Now",
        ),
        field(
            "Footer Book Label",
            "Footer column — link text to booking page.",
            "Text for the book link in the footer.",
            "Can match Header CTA or be slightly different.",
            "Book Now",
        ),
    ]
    for f in layout_fields:
        story.append(Paragraph(f, body))
        story.append(Spacer(1, 10))

    story.append(PageBreak())

    # 4.4 Homepage
    story.append(Paragraph("4.4 Homepage", h2))
    story.append(Paragraph("<b>Hero</b> — the big first screen visitors see.", h3))
    hero_fields = [
        field(
            "Badge",
            "Small pill/tag above the main headline.",
            "A short label highlighting your service type.",
            "3–6 words.",
            "Professional Curbside Service",
        ),
        field(
            "Headline",
            "Large main text, first line of the hero.",
            "Primary headline — what you do.",
            "Can end with a comma if the accent line continues the sentence.",
            "Professional Garbage Can Cleaning,",
        ),
        field(
            "Headline Accent",
            "Second line of headline, often in a bright color.",
            "The colorful emphasis words.",
            "Completes the headline thought.",
            "Sanitizing & Deodorizing",
        ),
        field(
            "Primary CTA",
            "Big green button in the hero.",
            "Main button text.",
            "Action-oriented, 2–4 words.",
            "Book a Cleaning",
        ),
        field(
            "Secondary CTA",
            "Outline/ghost button next to the primary one.",
            "Alternative action for people not ready to book.",
            "Often 'Get a Quote' or 'Learn More'.",
            "Get a Free Quote",
        ),
        field(
            "Trust Indicators (one per line)",
            "Small bullet/check items under the hero buttons.",
            "Quick trust points — one per line in the text box.",
            "Press Enter between each line. Each line becomes its own bullet.",
            "Convenient curbside service\nFamily-focused local business\nSatisfaction-focused service",
        ),
    ]
    for f in hero_fields:
        story.append(Paragraph(f, body))
        story.append(Spacer(1, 10))

    story.append(Paragraph("<b>Section Headings</b> — titles above each homepage block.", h3))
    section_headings = [
        ("How It Works Title", "Above the 4-step process icons.", "How It Works"),
        ("How It Works Subtitle", "Gray text under that title.", "Four simple steps to cleaner, fresher bins"),
        ("Pricing Title", "Above the pricing preview cards.", "Simple, Transparent Pricing"),
        ("Pricing Subtitle", "Under pricing title.", "Choose the plan that fits your home."),
        ("Testimonials Title", "Above customer quotes.", "What Our Customers Say"),
        ("FAQ Title", "Above the accordion questions.", "Frequently Asked Questions"),
        ("Service Area Title", "Above the ZIP code checker.", "Service Area"),
        ("Service Area Subtitle", "Under service area title.", "Check if we service your ZIP code."),
    ]
    for title, where, ex in section_headings:
        story.append(
            Paragraph(
                field(title, where, f"The heading text for the {title.replace(' Title', '').replace(' Subtitle', '')} section.", "Write clear, friendly text.", ex),
                body,
            )
        )
        story.append(Spacer(1, 8))

    story.append(Paragraph("<b>Final CTA</b> — bottom banner before the footer.", h3))
    final_cta = [
        field("Title", "Large text in the bottom call-to-action band.", "Closing headline.", "Motivational question or statement.", "Ready for Cleaner, Fresher Cans?"),
        field("Body", "Paragraph under the title.", "Extra sentence pushing them to act.", "1–2 sentences.", "Book your first cleaning today and take one unpleasant household job off your list."),
        field("Primary CTA", "Green button in the band.", "Book button label.", "Same style as hero primary.", "Book a Cleaning"),
        field("Secondary CTA", "Second button in the band.", "Quote/contact alternative.", "Short label.", "Request a Quote"),
    ]
    for f in final_cta:
        story.append(Paragraph(f, body))
        story.append(Spacer(1, 8))

    story.append(Paragraph("<b>Homepage Pricing Preview</b> — simplified plan cards on the homepage (not the full /pricing page).", h3))
    story.append(
        Paragraph(
            "Each plan card is a list item. Use Add Item for another card.",
            body,
        )
    )
    preview_fields = [
        field("Name", "Bold plan name on the card.", "Plan title.", "Short name.", "Monthly Plan"),
        field("Price", "Big price display.", "What customers see as the cost.", "Include $ sign.", "$25"),
        field("Description", "Gray text under the name.", "One-line plan summary.", "Keep it brief.", "Keep your bins fresh all month."),
        field("Note", "Small text under the price.", "Billing or unit clarification.", "per bin · Billed monthly", "per bin · Billed monthly"),
    ]
    for f in preview_fields:
        story.append(Paragraph(f, body))
        story.append(Spacer(1, 8))

    story.append(PageBreak())

    # 4.5 Page Headings
    story.append(Paragraph("4.5 Page Headings", h2))
    story.append(
        Paragraph(
            "These control the big title and subtitle at the top of individual pages (not the homepage).",
            body,
        )
    )
    page_fields = [
        field("Services Title", "Top of /services page.", "Main heading.", "Clear page title.", "Our Services"),
        field("Services Subtitle", "Gray text under services title.", "Longer explanation.", "1–2 sentences about what you offer.", "Professional curbside garbage can cleaning..."),
        field("Services CTA Label", "Button on each service card.", "Text on 'book this' buttons.", "Action phrase.", "Book This Service"),
        field("Contact Title", "Top of /contact page.", "Page heading.", "Welcoming title.", "Contact Us"),
        field("Contact Subtitle", "Under contact title.", "Invite people to reach out.", "Have a question or need a quote? We're here to help."),
        field("Book Title", "Top of /book page.", "Booking form page heading.", "Tell them what they're doing.", "Book a Cleaning"),
        field("Book Subtitle", "Under book title.", "Instructions above the form.", "Complete the form below to request your curbside bin cleaning service."),
        field("Pricing Quote Title", "Callout box on /pricing page.", "Custom quote section heading.", "Need a Custom Quote?"),
        field("Pricing Quote Subtitle", "Text under quote title.", "Encourages form fill.", "Tell us about your bins and we'll send pricing details."),
    ]
    for f in page_fields:
        story.append(Paragraph(f, body))
        story.append(Spacer(1, 10))

    # 4.6 Features
    story.append(Paragraph("4.6 Features", h2))
    story.append(
        Paragraph(
            "Feature cards appear in a grid on the homepage — icon, title, and description for each benefit.",
            body,
        )
    )
    feature_fields = [
        field("Title", "Bold text on each feature card.", "Benefit name.", "2–4 words.", "Deep Cleaning"),
        field(
            "Icon",
            "Small icon above the title.",
            "Icon keyword — the site picks a matching picture.",
            "Use lowercase icon names from Lucide icons: sparkles, wind, shield, truck, calendar, refresh-cw, droplets, map-pin, leaf, smile.",
            "sparkles",
            "Wrong icon name = missing or default icon.",
        ),
        field("Description", "Gray paragraph on the card.", "Explain the benefit.", "1–2 sentences.", "High-pressure washing removes grime, residue, and buildup from inside and out."),
    ]
    for f in feature_fields:
        story.append(Paragraph(f, body))
        story.append(Spacer(1, 8))

    # 4.7 How It Works
    story.append(Paragraph("4.7 How It Works", h2))
    story.append(
        Paragraph(
            "Numbered steps shown in a row on the homepage. Each list item = one step.",
            body,
        )
    )
    hiw_fields = [
        field("Title", "Step name under the step number.", "What happens in this step.", "Short verb phrase.", "Book Online"),
        field("Step Number", "The big number circle (1, 2, 3, 4).", "Order of steps.", "Use whole numbers 1, 2, 3, 4. Keep them in order.", "1"),
        field("Description", "Explanation under the title.", "Details for this step.", "1–2 sentences.", "Choose your service, pick a date, and tell us how many bins need cleaning."),
    ]
    for f in hiw_fields:
        story.append(Paragraph(f, body))
        story.append(Spacer(1, 8))

    story.append(PageBreak())

    # 4.8 Pricing
    story.append(Paragraph("4.8 Pricing Plans", h2))
    story.append(
        Paragraph(
            "Full pricing cards on the /pricing page. More detailed than Homepage Pricing Preview.",
            body,
        )
    )
    story.append(
        Paragraph(
            field(
                "Recurring Savings Label",
                "Badge or label on recurring plans showing savings.",
                "Text next to the savings percentage.",
                "Short phrase.",
                "Save with recurring plans",
            ),
            body,
        )
    )
    story.append(Spacer(1, 8))
    story.append(
        Paragraph(
            field(
                "Savings Percent",
                "Numeric badge — e.g. 'Save 20%'.",
                "How much cheaper recurring is vs one-time.",
                "Enter a number only (no % sign). Leave empty if unknown.",
                "20",
            ),
            body,
        )
    )
    story.append(Spacer(1, 12))
    story.append(Paragraph("<b>Each pricing plan</b> (list item):", h3))
    plan_fields = [
        field("Name", "Plan card title.", "Plan name.", "One-Time Clean, Monthly Plan, etc."),
        field("Price Label", "Large price on card.", "Displayed price.", "$35 or 'From $25'"),
        field("Description", "Under the plan name.", "Who the plan is for.", "Perfect for a fresh start."),
        field("Price Note", "Small text under price.", "Per-bin or billing note.", "per bin · Billed monthly"),
        field("CTA Label", "Button on the card.", "Button text.", "Book Now"),
        field("CTA Link", "Where the button goes.", "Usually /book or /contact.", "/book"),
        field(
            "Features (one per line)",
            "Checkmark list on the pricing card.",
            "What's included — one feature per line.",
            "Press Enter between lines. Each becomes a bullet with a checkmark.",
            "Exterior & interior cleaning\nSanitizing treatment\nDeodorizing",
        ),
    ]
    for f in plan_fields:
        story.append(Paragraph(f, body))
        story.append(Spacer(1, 8))

    # 4.9 Services
    story.append(Paragraph("4.9 Services", h2))
    story.append(
        Paragraph(
            "Detailed service offerings on the /services page — one list item per service type.",
            body,
        )
    )
    service_fields = [
        field("Name", "Service card heading.", "Service name.", "Residential Bin Cleaning"),
        field("Price Label", "Price shown on card.", "Starting price or range.", "From $35/bin"),
        field("Description", "Main paragraph.", "What the service includes at a high level.", "Full curbside deep clean..."),
        field("Duration", "Small badge — how long it takes.", "Time estimate.", "~15 min per bin"),
        field("Booking Link", "Button destination.", "Where 'Book' goes.", "/book"),
        field(
            "Included (one per line)",
            "Bullet list of what's included.",
            "Each line = one bullet.",
            "One item per line.",
            "Pressure wash interior & exterior\nEco-friendly sanitizing\nDeodorizing treatment",
        ),
    ]
    for f in service_fields:
        story.append(Paragraph(f, body))
        story.append(Spacer(1, 8))

    # 4.10 FAQ
    story.append(Paragraph("4.10 FAQ", h2))
    story.append(
        Paragraph(
            "Accordion on homepage and FAQ section — click question to expand answer.",
            body,
        )
    )
    story.append(
        Paragraph(
            field("Question", "Bold clickable row.", "What customers ask.", "Write as a real question ending with ?", "Do I need to be home?"),
            body,
        )
    )
    story.append(Spacer(1, 8))
    story.append(
        Paragraph(
            field("Answer", "Hidden text that slides open.", "Your clear answer.", "2–5 sentences. Plain language.", "No. As long as your bins are accessible..."),
            body,
        )
    )

    # 4.11 Testimonials
    story.append(Paragraph("4.11 Testimonials", h2))
    story.append(
        Paragraph(
            "Customer quote carousel/grid on homepage. Only add real reviews you have permission to use.",
            body,
        )
    )
    testimonial_fields = [
        field("Quote", "Large italic quote text.", "What the customer said.", "1–3 sentences in first person.", "Our bins have never smelled this good!"),
        field("Author", "Name under the quote.", "Customer first name + last initial or full name.", "Sarah M."),
        field("Location", "City or neighborhood.", "Where they're from.", "Springfield, MO"),
    ]
    for f in testimonial_fields:
        story.append(Paragraph(f, body))
        story.append(Spacer(1, 8))

    story.append(PageBreak())

    # 4.12 About
    story.append(Paragraph("4.12 About", h2))
    story.append(
        Paragraph(
            field(
                "Headline",
                "Top of /about page.",
                "Main about page title.",
                "Welcoming headline about your story.",
                "Built by Neighbors, for Neighbors",
            ),
            body,
        )
    )
    story.append(Spacer(1, 8))
    story.append(
        Paragraph(
            field(
                "Story (one paragraph per line)",
                "Body text on about page — multiple paragraphs.",
                "Your origin story and mission.",
                "Separate paragraphs with a blank line (press Enter twice). Each block becomes its own paragraph.",
                "Paragraph one about how you started...\n\nParagraph two about your values...",
            ),
            body,
        )
    )
    story.append(Spacer(1, 8))
    story.append(
        Paragraph(
            field(
                "Founders Note",
                "Signed note from founders.",
                "Personal message.",
                "Short closing note.",
                "— The JHCleans Team",
            ),
            body,
        )
    )
    story.append(Spacer(1, 12))
    story.append(Paragraph("<b>Values</b> (list items) — principle cards on about page:", h3))
    story.append(
        Paragraph(
            field("Title", "Value name on card.", "Principle name.", "Quality, Community, etc."),
            body,
        )
    )
    story.append(Spacer(1, 8))
    story.append(
        Paragraph(
            field("Description", "Text under value title.", "Explain the value.", "1–2 sentences."),
            body,
        )
    )

    # 4.13 Service Area
    story.append(Paragraph("4.13 Service Area", h2))
    story.append(
        Paragraph(
            "Powers the ZIP code checker on the homepage — visitors type a ZIP and see if you serve them.",
            body,
        )
    )
    area_fields = [
        field(
            "Region Label",
            "Heading above the city list.",
            "Geographic area name.",
            "Name your region.",
            "Greater Springfield Area",
        ),
        field(
            "Map Note",
            "Text near the map or ZIP tool.",
            "Extra geography info.",
            "Mention expansion plans if relevant.",
            "Don't see your ZIP? Contact us — we may still be able to help.",
        ),
        field(
            "Serviced ZIP Codes (comma separated)",
            "ZIPs that get a green 'Yes, we serve you!' message.",
            "Confirmed service ZIP codes.",
            "5-digit ZIPs separated by commas. Spaces OK.",
            "65801, 65802, 65803",
            "Wrong ZIP = lost customers who think you don't serve them.",
        ),
        field(
            "Maybe ZIP Codes (comma separated)",
            "ZIPs that get a yellow 'maybe' message — you might serve with extra fee or on request.",
            "Borderline or new areas.",
            "Same comma format.",
            "65804, 65810",
        ),
        field("City", "Featured cities list — city name.", "City you highlight.", "Springfield"),
        field("State", "Featured cities — state code.", "2-letter state.", "MO"),
    ]
    for f in area_fields:
        story.append(Paragraph(f, body))
        story.append(Spacer(1, 8))

    # 4.14 Legal
    story.append(Paragraph("4.14 Legal Pages", h2))
    story.append(
        Paragraph(
            "Four legal documents: Privacy Policy, Terms of Service, Cancellation Policy, Service Agreement. "
            "Each has the same field pattern. Have a lawyer review before launch.",
            body,
        )
    )
    legal_fields = [
        field(
            "Last Updated",
            "Top of each legal page.",
            "Date the policy was last revised.",
            "Human-readable date.",
            "March 15, 2026",
        ),
        field(
            "Section Title",
            "Bold heading within the legal page.",
            "Topic of that section.",
            "Clear legal section name.",
            "Information We Collect",
        ),
        field(
            "Section Content",
            "Paragraph(s) under each section title.",
            "The actual legal text.",
            "Write in complete sentences. Use Add Item for new sections.",
            "We may collect personal information you provide through our website forms...",
        ),
    ]
    for f in legal_fields:
        story.append(Paragraph(f, body))
        story.append(Spacer(1, 8))

    story.append(PageBreak())

    # Chapter 5 Calendar
    story.append(Paragraph("5. Calendar — Job Form Fields", h1))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#00d2ff")))
    story.append(Spacer(1, 12))
    story.append(
        Paragraph(
            "Open <b>Calendar</b> from the sidebar. The calendar shows jobs as colored blocks. "
            "<b>Click empty space</b> to create a job at that time. <b>Click a job</b> to edit. "
            "<b>Drag a job</b> to reschedule. Use filter buttons (All, Pending, Scheduled, etc.) to hide/show statuses. "
            "Click <b>New Job</b> for a blank form.",
            body,
        )
    )
    story.append(Spacer(1, 12))

    status_table = [
        ["Status", "Color", "When to Use"],
        ["Pending", "Orange", "New website booking — not confirmed yet"],
        ["Scheduled", "Cyan", "Confirmed and on the calendar"],
        ["In Progress", "Purple", "Crew is actively cleaning now"],
        ["Completed", "Green", "Job finished successfully"],
        ["Cancelled", "Gray", "Job won't happen"],
    ]
    t2 = Table(status_table, colWidths=[1.2 * inch, 0.8 * inch, 4 * inch])
    t2.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0c1529")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#00d2ff")),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#334155")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#111827"), colors.HexColor("#1e293b")]),
            ]
        )
    )
    story.append(t2)
    story.append(Spacer(1, 16))

    job_fields = [
        field(
            "Job Title",
            "Shown on the calendar block and in lists.",
            "Short name so you recognize the job at a glance.",
            "Use customer name + service type. Required.",
            "Smith Residence — Monthly",
        ),
        field(
            "Customer Name",
            "Internal record — also from website bookings.",
            "Full name of the person booking.",
            "First and last name. Required.",
            "John Smith",
        ),
        field(
            "Phone",
            "For calling/texting the customer.",
            "Customer phone number.",
            "At least 10 digits. Required.",
            "555-123-4567",
        ),
        field(
            "Email",
            "For confirmations and receipts.",
            "Customer email.",
            "Must be a valid email format. Required.",
            "john@email.com",
        ),
        field(
            "Street Address",
            "Where the bins are.",
            "House number and street.",
            "Full street address. Required.",
            "123 Oak Street",
        ),
        field("City", "Job city.", "City name.", "Required.", "Springfield"),
        field("State", "Job state.", "2-letter code only.", "Exactly 2 letters like MO. Required."),
        field(
            "ZIP Code",
            "Job ZIP.",
            "5-digit US ZIP (optional +4).",
            "65801 or 65801-1234. Required.",
        ),
        field(
            "Service Type",
            "Dropdown — billing frequency.",
            "One-Time, Monthly, Bi-Weekly, or Multi-Can.",
            "Pick the plan type. Affects how you think about repeat visits.",
        ),
        field(
            "Garbage Cans",
            "Number input.",
            "How many trash bins to clean.",
            "Whole number 0–20. Usually at least 1.",
            "2",
        ),
        field(
            "Recycling Cans",
            "Number input.",
            "How many recycling bins.",
            "Whole number 0–20. Use 0 if none.",
            "1",
        ),
        field(
            "Time Window",
            "Customer preference — Morning, Afternoon, or Flexible.",
            "Rough arrival window (not exact clock time).",
            "Pick what the customer requested.",
            "Morning (8 AM – 12 PM)",
        ),
        field(
            "Status",
            "Dropdown — job lifecycle stage.",
            "See status table above.",
            "Move Pending → Scheduled when confirmed, then Completed when done.",
        ),
        field(
            "Start",
            "Datetime picker — when the job block starts on calendar.",
            "Scheduled start date and time.",
            "Click the field and pick date + time. Required.",
            "2026-07-15 09:00",
        ),
        field(
            "End",
            "Datetime picker — when the block ends.",
            "Scheduled end (usually ~1 hour after start).",
            "Must be after Start. Required.",
            "2026-07-15 10:00",
        ),
        field(
            "Revenue ($)",
            "Money you expect to earn from this job.",
            "Dollar amount for this cleaning.",
            "Numbers only, can use cents. 0 if not priced yet.",
            "75.00",
            "Saving a job does not auto-add to Finances — add a revenue transaction separately if needed.",
        ),
        field(
            "Notes",
            "Internal only — not shown to customers on the website.",
            "Gate codes, dog warnings, special instructions.",
            "Optional, max 500 characters.",
            "Blue house, bins on left side of driveway",
        ),
    ]
    for f in job_fields:
        story.append(Paragraph(f, body))
        story.append(Spacer(1, 10))

    story.append(
        Paragraph(
            "<b>Quick status buttons</b> (when editing an existing job): One-click buttons to change status "
            "without scrolling — useful on a phone after finishing a job.",
            note,
        )
    )
    story.append(
        Paragraph(
            "<b>Booking ref</b> (read-only): If the job came from the website booking form, a reference code "
            "appears at the bottom. Use it when talking to the customer.",
            note,
        )
    )
    story.append(PageBreak())

    # Chapter 6 Finances
    story.append(Paragraph("6. Finances — Transaction Form Fields", h1))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#00d2ff")))
    story.append(Spacer(1, 12))
    story.append(
        Paragraph(
            "The Finances page shows summary cards, charts, and a transaction table. "
            "Click <b>Add Transaction</b> or <b>Edit</b> on a row to open the form.",
            body,
        )
    )
    story.append(Spacer(1, 12))

    expense_cats = [
        ["Category", "Use For"],
        ["Cleaning Supplies", "Soap, deodorizer, chemicals"],
        ["Equipment", "Pressure washer parts, hoses, bins"],
        ["Fuel & Transport", "Gas, vehicle costs"],
        ["Marketing", "Ads, flyers, website costs"],
        ["Insurance", "Business insurance payments"],
        ["Other", "Anything that doesn't fit above"],
    ]
    t3 = Table(expense_cats, colWidths=[1.8 * inch, 4.2 * inch])
    t3.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0c1529")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#00d2ff")),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#334155")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#111827"), colors.HexColor("#1e293b")]),
            ]
        )
    )
    story.append(t3)
    story.append(Spacer(1, 16))

    tx_fields = [
        field(
            "Type",
            "Revenue or Expense dropdown.",
            "Money in (Revenue) or money out (Expense).",
            "Pick Revenue when a customer pays you. Pick Expense when you buy something for the business.",
        ),
        field(
            "Category",
            "Only shows for Expenses.",
            "What kind of expense.",
            "Pick the closest category from the table above. Revenue auto-uses 'Service Revenue'.",
        ),
        field(
            "Amount ($)",
            "Dollar value in lists and charts.",
            "How much money.",
            "Must be greater than $0. Use decimals for cents.",
            "45.99",
        ),
        field(
            "Date",
            "When the money changed hands.",
            "Transaction date.",
            "Click the date picker. Use the actual payment date.",
        ),
        field(
            "Description",
            "Shows in the transaction table.",
            "Short label so you remember what it was.",
            "Required. Be specific.",
            "Monthly plan — Smith residence",
        ),
        field(
            "Vendor (optional)",
            "Only for expenses — small gray text under description.",
            "Who you paid.",
            "Store or supplier name.",
            "Home Depot",
        ),
    ]
    for f in tx_fields:
        story.append(Paragraph(f, body))
        story.append(Spacer(1, 10))

    story.append(PageBreak())

    # Chapter 7
    story.append(Paragraph("7. Saving, Resetting &amp; Common Mistakes", h1))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#00d2ff")))
    story.append(Spacer(1, 12))

    tips = [
        ("Forgetting to Save Section", "Site Content changes are lost if you switch categories or close the tab without clicking Save Section."),
        ("Wrong phone format", "Display phone ≠ tel link. Display: (555) 123-4567. Tel link: +15551234567."),
        ("Broken navigation URLs", "URLs must start with / and match real pages. Test every link after editing."),
        ("One-per-line fields", "Trust Indicators, Features, Included items — each line is a separate bullet. Don't use commas on one line."),
        ("Story paragraphs", "About → Story uses blank lines between paragraphs, not single Enter."),
        ("ZIP codes", "Use 5 digits, comma-separated. No 'ZIP' word, just numbers."),
        ("State codes", "Always 2 letters: MO not Missouri, in job forms and addresses."),
        ("Legal content", "Replace all [UPDATE...] placeholder text before launch. Have a lawyer review."),
        ("Fake testimonials", "Only use real reviews with permission."),
        ("Pending jobs", "Website bookings arrive as Pending — change to Scheduled when you confirm the date."),
        ("Revenue tracking", "Job revenue field is for reference; add a Finances transaction to track money in reports."),
    ]
    for title, desc in tips:
        story.append(Paragraph(f"<b>{title}</b> — {desc}", body))
        story.append(Spacer(1, 8))

    story.append(Spacer(1, 24))
    story.append(
        Paragraph(
            "<i>Generated for JHCleans Admin Portal. Match this guide to the live admin UI — "
            "if a field label differs slightly, it is the same field described here.</i>",
            note,
        )
    )

    return story


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=letter,
        rightMargin=0.75 * inch,
        leftMargin=0.75 * inch,
        topMargin=0.75 * inch,
        bottomMargin=0.75 * inch,
        title="JHCleans Admin Portal Guide",
        author="JHCleans",
    )

    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="H1",
            parent=styles["Heading1"],
            fontSize=20,
            spaceAfter=12,
            textColor=colors.HexColor("#00d2ff"),
        )
    )
    styles.add(
        ParagraphStyle(
            name="H2",
            parent=styles["Heading2"],
            fontSize=14,
            spaceBefore=16,
            spaceAfter=8,
            textColor=colors.HexColor("#4ade80"),
        )
    )
    styles.add(
        ParagraphStyle(
            name="H3",
            parent=styles["Heading3"],
            fontSize=11,
            spaceBefore=10,
            spaceAfter=6,
            textColor=colors.HexColor("#94a3b8"),
        )
    )
    styles.add(
        ParagraphStyle(
            name="Body",
            parent=styles["Normal"],
            fontSize=10,
            leading=14,
            spaceAfter=4,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Note",
            parent=styles["Normal"],
            fontSize=9,
            leading=12,
            textColor=colors.HexColor("#64748b"),
            leftIndent=12,
            borderColor=colors.HexColor("#334155"),
            borderWidth=1,
            borderPadding=8,
        )
    )

    def add_page_number(canvas, doc_obj):
        canvas.saveState()
        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(colors.HexColor("#64748b"))
        canvas.drawCentredString(
            letter[0] / 2,
            0.5 * inch,
            f"JHCleans Admin Guide — Page {doc_obj.page}",
        )
        canvas.restoreState()

    doc.build(build_story(styles), onFirstPage=add_page_number, onLaterPages=add_page_number)
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    main()
