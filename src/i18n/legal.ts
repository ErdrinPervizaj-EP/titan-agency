import type { Lang } from './translations';

/**
 * Legal page copy. It describes what this site actually does: contact and
 * support messages become tickets, there is no analytics, advertising or
 * tracking, fonts are self-hosted, and the only cookie is TitanDesk's own
 * sign-in cookie for people who use TitanDesk. Company specifics (legal name,
 * address, registration) are filled in from the Super Admin company details.
 * Have these reviewed by a lawyer before relying on them.
 */
export interface LegalSection { heading: string; body: string[] }
export interface LegalPage { title: string; intro: string; sections: LegalSection[] }
export type LegalPageKey = 'privacy' | 'terms' | 'security' | 'service' | 'refunds';

export const LAST_UPDATED: Record<Lang, string> = { en: 'Last updated: 23 September 2026', de: 'Stand: 23. September 2026' };

export const LEGAL: Record<Lang, Record<LegalPageKey, LegalPage> & { imprint: { title: string; intro: string; labels: Record<string, string>; missing: string } }> = {
  en: {
    privacy: {
      title: 'Privacy Policy',
      intro: 'This policy explains what personal data this website processes, why, and what rights you have. We keep it short because we collect very little.',
      sections: [
        { heading: 'Who is responsible', body: ['{controller} is responsible for this website. You can reach us at {email} for anything about your data.'] },
        { heading: 'What we do not do', body: ['We do not use analytics, advertising or tracking tools, and we do not sell or share your data for marketing. Our fonts are served from this site, so loading a page does not send your data to a font provider.'] },
        { heading: 'Contact and support messages', body: ['When you use the contact form or the "Talk to us" widget, we process your name, email address, company (if given), your message and the page you sent it from. We store it as a support ticket in our own service desk, TitanDesk, so we can answer you.', 'Legal basis: taking steps at your request before a contract, or our legitimate interest in answering enquiries (Art. 6(1)(b) and (f) GDPR). We keep the ticket while we handle your request and for as long as we need a record of it, then delete it.'] },
        { heading: 'Sales enquiries', body: ['When you use the Enterprise "Talk to sales" form, we also process your team size, the tool you use today, the topics you ticked and, if you are signed in, your workspace ID. We store it as a lead and a ticket in TitanDesk so we can prepare a quote and follow up (Art. 6(1)(b) GDPR). If no agreement follows, we delete it within 24 months of our last contact.'] },
        { heading: 'TitanDesk accounts and payments', body: ['If you create a TitanDesk account, we process your name, email address, sign-in details and workspace settings to provide the service (Art. 6(1)(b) GDPR). Card payments are handled by Stripe; we never see or store your full card number. We keep invoices and payment records for as long as tax law requires.'] },
        { heading: 'Data you store in TitanDesk', body: ['Tickets, customers, devices and other records your organisation puts into TitanDesk belong to your organisation. For that data we act as a processor on your instructions, under the data processing terms in our Terms of Service. If your workspace connects its own AI provider, TitanDesk sends the content you ask it to work on to that provider using your key; we do not use your data to train AI models.'] },
        { heading: 'Server logs', body: ['Like any website, the servers that deliver it briefly record technical data such as your IP address, browser type and the time of the request. This keeps the site running and secure (Art. 6(1)(f) GDPR). These logs are deleted after a short period.'] },
        { heading: 'Cookies and local storage', body: ['This website sets no cookies of its own and stores nothing in your browser. If you use TitanDesk, it sets a sign-in cookie when you log in; this site reads it only to show "Go to workspace" instead of "Log in". That cookie is strictly necessary for signing in, so no consent banner is needed.'] },
        { heading: 'Who receives data', body: ['Our hosting provider, our email delivery provider and, for payments, Stripe process data for us under data processing agreements, only to run this site and TitanDesk, take payments and send you our replies.'] },
        { heading: 'Your rights', body: ['You can ask us for access to, correction or deletion of your data, restrict or object to its processing, and receive it in a portable format. You can also complain to a data protection supervisory authority. Write to {email} to use any of these rights.'] },
        { heading: 'Changes', body: ['If we change what we process, we will update this page and its date.'] },
      ],
    },
    terms: {
      title: 'Terms of Use',
      intro: 'These terms cover your use of this website. TitanDesk is covered by the TitanDesk Terms of Service, and our agency services by the contract you sign with us.',
      sections: [
        { heading: 'Using this website', body: ['You may browse this website and use its forms for genuine enquiries. Please do not misuse it, for example by attempting to disrupt it, probing it without permission (see our Security page for how to report issues), or sending spam through its forms.'] },
        { heading: 'Information on this site', body: ['We keep the information here accurate and up to date, but it is general information, not an offer or professional advice. Prices and features shown for TitanDesk may change; the terms in force when you subscribe apply.'] },
        { heading: 'Intellectual property', body: ['The content, design and code of this website belong to {controller} or are used with permission. Product names and logos of other companies belong to their owners and are shown only to describe the technologies we work with.'] },
        { heading: 'Links', body: ['Links to other websites are provided for convenience. We are not responsible for their content.'] },
        { heading: 'Liability', body: ['We are liable without limitation for intent and gross negligence and as required by mandatory law. Otherwise, to the extent permitted by law, we are not liable for damages arising from the use of this website.'] },
        { heading: 'Contact', body: ['Questions about these terms: {email}.'] },
      ],
    },
    security: {
      title: 'Security & Responsible Disclosure',
      intro: 'We run IT for other businesses, so we take reports about our own systems seriously. If you believe you have found a security issue in this website or in TitanDesk, please tell us.',
      sections: [
        { heading: 'How to report', body: ['Email {email} with the subject "Security", or use "Talk to us" → "Report a problem" → "Security". Include what you found, where, and the steps to reproduce it.'] },
        { heading: 'Please', body: ['Only test against accounts you own, and access no more data than needed to show the problem. Do not run denial-of-service tests, social engineering or physical attacks. Give us reasonable time to fix the issue before making it public.'] },
        { heading: 'Our commitment', body: ['We aim to acknowledge reports within three business days, keep you updated while we fix the issue, and credit you if you wish. We will not take legal action against research carried out in good faith within these guidelines.'] },
        { heading: 'How we protect data', body: ['Sign-in uses hashed passwords, optional two-factor authentication and passkeys; sessions use secure, HTTP-only cookies; sensitive settings such as customer AI keys and two-factor secrets are encrypted at rest; administrative actions require fresh authentication and are recorded in an audit log; and our network gateway only ever connects out, so customers never open inbound firewall ports.'] },
      ],
    },
    service: {
      title: 'TitanDesk Terms of Service',
      intro: 'These terms apply when your organisation creates a TitanDesk workspace or subscribes to a TitanDesk plan. By creating an account you accept them on behalf of your organisation. An Enterprise agreement signed with us takes precedence where it differs.',
      sections: [
        { heading: 'The service', body: ['TitanDesk is a service desk provided by {controller} as software you use over the internet, together with the optional network gateway you install on networks you manage. We may improve and change features; we will not remove core functionality of a plan you are paying for during a paid period without telling you in advance.'] },
        { heading: 'Your account', body: ['You must give accurate details and keep sign-in details safe. The person who creates the workspace confirms they may bind the organisation to these terms. You are responsible for what happens under your workspace and for the users you invite, and you must tell us promptly at {email} if you suspect unauthorised access.'] },
        { heading: 'Acceptable use', body: ['Do not use TitanDesk to break the law, to store content you have no right to store, to send spam, or to attack or probe systems you are not authorised to manage. Only install the gateway on networks you are responsible for, and only run diagnostics against devices you are allowed to test. Do not try to get around plan limits, security controls or other workspaces’ separation.'] },
        { heading: 'Trial, plans and payment', body: ['Every new workspace starts with a 14-day free trial of the Business features; no card is needed. After that you choose a plan. Team and Business are billed per user each month in advance by card through Stripe; Enterprise is invoiced under its agreement. Prices exclude VAT where it applies. We will give you at least 30 days’ notice of a price change, and it applies from your next billing period.', 'Cancellations and refunds follow our Refund & Cancellation Policy.'] },
        { heading: 'Your data', body: ['The data your organisation stores in TitanDesk stays yours. We use it only to provide, secure and support the service, and act as your processor under Art. 28 GDPR: we process it on your documented instructions, keep it confidential, protect it with appropriate technical and organisational measures, use sub-processors (such as hosting, email delivery and Stripe) only under equivalent obligations, help you respond to data subject requests, tell you without undue delay about a personal data breach, and delete or return it when the service ends. Enterprise customers can sign a separate data processing agreement.', 'You can export your data while your workspace is active. When you stop using TitanDesk, the workspace owner can ask us at {email} to delete the workspace; we delete its data within 30 days, apart from records we must keep by law.'] },
        { heading: 'Availability and support', body: ['We work to keep TitanDesk available and back up data regularly, but on Team and Business we do not guarantee a specific uptime. Planned maintenance will be announced where possible. Support is provided by email and in-app; Business gets priority. Enterprise uptime and response commitments are set in its agreement.'] },
        { heading: 'Suspension and termination', body: ['You can cancel at any time from your billing settings. We may suspend a workspace if payment is overdue after reminders, or immediately if it is used in serious breach of these terms or puts other customers or the service at risk; we will tell you why and restore access once the issue is fixed. Either side may end the agreement for material breach that is not fixed within 14 days of notice.'] },
        { heading: 'Liability', body: ['We are liable without limitation for intent, gross negligence, injury to life, body or health, and where mandatory law requires it. For slight negligence we are liable only for breach of essential contractual obligations and only up to the damage typical and foreseeable for this kind of contract, and in total at most the fees you paid in the 12 months before the event. We are not liable for loss caused by the networks or devices you manage, or by third-party services you connect, such as your AI provider.'] },
        { heading: 'Changes to these terms', body: ['If we change these terms, we will tell workspace owners by email at least 30 days in advance. If you do not agree, you can cancel before the change takes effect.'] },
        { heading: 'Law and contact', body: ['These terms are governed by the law of the country in which {controller} is registered, without prejudice to mandatory consumer or data protection law. Questions: {email}.'] },
      ],
    },
    refunds: {
      title: 'Refund & Cancellation Policy',
      intro: 'How trials, cancellations and refunds work for TitanDesk. Our agency services (managed IT, projects) are covered by the contract or quote you sign with us.',
      sections: [
        { heading: 'Free trial', body: ['Every new workspace gets 14 days of the Business features for free, with no card on file, so there is nothing to refund. When the trial ends, the Business-only features switch off until you choose a plan. Your data stays in place.'] },
        { heading: '30-day money-back guarantee', body: ['If TitanDesk is not right for you, you can ask for a full refund within 30 days of your first payment. Use "Request a refund" in Settings → Billing, or email {email}. We refund your most recent payment in full and end the subscription straight away. The guarantee covers the first 30 days after you first subscribe; cancelling and subscribing again does not restart it.'] },
        { heading: 'Cancelling', body: ['You can cancel at any time in Settings → Billing. Your plan stays active until the end of the period you have already paid for, and you will not be charged again. We do not refund partly used billing periods outside the 30-day guarantee.'] },
        { heading: 'Changing plans', body: ['You can switch between Team and Business in Settings → Billing. If you already pay by card, the switch happens on your existing subscription and Stripe adjusts the charge for the rest of the current period, so you are never billed twice.'] },
        { heading: 'Enterprise', body: ['Enterprise is billed under a signed agreement. Its term, notice period and any refunds are set in that agreement. When a workspace moves to Enterprise, any card subscription is ended and the remaining paid time is credited on the first invoice.'] },
        { heading: 'Failed payments', body: ['If a payment fails, Stripe retries it automatically and your plan shows as Past due in Settings → Billing, where you can update your card. If it still cannot be collected, the subscription ends and the Business-only features switch off. We do not delete data because of a failed payment.'] },
        { heading: 'Your legal rights', body: ['This policy does not limit any rights you have under mandatory law. If you think we charged you by mistake, email {email} and we will look into it within five business days.'] },
      ],
    },
    imprint: {
      title: 'Imprint',
      intro: 'Information about the operator of this website.',
      labels: { name: 'Operator', address: 'Address', representative: 'Represented by', email: 'Email', phone: 'Phone', registration: 'Registration', vatId: 'VAT ID' },
      missing: 'Further company details are being added.',
    },
  },
  de: {
    privacy: {
      title: 'Datenschutzerklärung',
      intro: 'Diese Erklärung beschreibt, welche personenbezogenen Daten diese Website verarbeitet, warum und welche Rechte Sie haben. Sie ist kurz, weil wir sehr wenig erheben.',
      sections: [
        { heading: 'Verantwortlicher', body: ['Verantwortlich für diese Website ist {controller}. Bei allen Fragen zu Ihren Daten erreichen Sie uns unter {email}.'] },
        { heading: 'Was wir nicht tun', body: ['Wir setzen keine Analyse-, Werbe- oder Tracking-Werkzeuge ein und verkaufen oder teilen Ihre Daten nicht zu Werbezwecken. Schriftarten werden von dieser Website selbst ausgeliefert, beim Seitenaufruf gehen also keine Daten an einen Schriftarten-Anbieter.'] },
        { heading: 'Kontakt- und Support-Nachrichten', body: ['Wenn Sie das Kontaktformular oder das „Sprechen Sie mit uns“-Fenster nutzen, verarbeiten wir Ihren Namen, Ihre E-Mail-Adresse, Ihre Firma (falls angegeben), Ihre Nachricht und die Seite, von der Sie sie gesendet haben. Wir speichern sie als Support-Ticket in unserem eigenen Service Desk TitanDesk, um Ihnen zu antworten.', 'Rechtsgrundlage: vorvertragliche Maßnahmen auf Ihre Anfrage bzw. unser berechtigtes Interesse an der Beantwortung von Anfragen (Art. 6 Abs. 1 lit. b und f DSGVO). Wir bewahren das Ticket auf, solange wir Ihre Anfrage bearbeiten und einen Nachweis darüber benötigen, und löschen es danach.'] },
        { heading: 'Vertriebsanfragen', body: ['Wenn Sie das Enterprise-Formular „Vertrieb kontaktieren“ nutzen, verarbeiten wir zusätzlich Ihre Teamgröße, Ihr aktuelles Werkzeug, die angekreuzten Themen und, falls Sie angemeldet sind, Ihre Workspace-ID. Wir speichern dies als Lead und Ticket in TitanDesk, um ein Angebot vorzubereiten und nachzufassen (Art. 6 Abs. 1 lit. b DSGVO). Kommt kein Vertrag zustande, löschen wir die Daten spätestens 24 Monate nach dem letzten Kontakt.'] },
        { heading: 'TitanDesk-Konten und Zahlungen', body: ['Wenn Sie ein TitanDesk-Konto anlegen, verarbeiten wir Ihren Namen, Ihre E-Mail-Adresse, Anmeldedaten und Workspace-Einstellungen, um den Dienst zu erbringen (Art. 6 Abs. 1 lit. b DSGVO). Kartenzahlungen wickelt Stripe ab; wir sehen und speichern Ihre vollständige Kartennummer nie. Rechnungen und Zahlungsbelege bewahren wir so lange auf, wie das Steuerrecht es verlangt.'] },
        { heading: 'Daten, die Sie in TitanDesk speichern', body: ['Tickets, Kunden, Geräte und andere Datensätze, die Ihre Organisation in TitanDesk erfasst, gehören Ihrer Organisation. Für diese Daten sind wir Auftragsverarbeiter nach Ihren Weisungen, gemäß den Bestimmungen zur Auftragsverarbeitung in unseren Nutzungsbedingungen für TitanDesk. Verbindet Ihr Workspace einen eigenen KI-Anbieter, sendet TitanDesk die Inhalte, die Sie bearbeiten lassen, mit Ihrem Schlüssel an diesen Anbieter; wir verwenden Ihre Daten nicht zum Training von KI-Modellen.'] },
        { heading: 'Server-Protokolle', body: ['Wie bei jeder Website erfassen die ausliefernden Server kurzzeitig technische Daten wie IP-Adresse, Browsertyp und Zeitpunkt des Aufrufs. Das dient dem sicheren Betrieb (Art. 6 Abs. 1 lit. f DSGVO). Diese Protokolle werden nach kurzer Zeit gelöscht.'] },
        { heading: 'Cookies und lokaler Speicher', body: ['Diese Website setzt keine eigenen Cookies und speichert nichts in Ihrem Browser. Wenn Sie TitanDesk nutzen, setzt TitanDesk bei der Anmeldung ein Anmelde-Cookie; diese Website liest es nur, um „Zum Arbeitsbereich“ statt „Anmelden“ anzuzeigen. Dieses Cookie ist für die Anmeldung technisch notwendig, daher ist kein Einwilligungsbanner erforderlich.'] },
        { heading: 'Empfänger', body: ['Unser Hosting-Anbieter, unser E-Mail-Versanddienst und für Zahlungen Stripe verarbeiten Daten in unserem Auftrag auf Grundlage von Auftragsverarbeitungsverträgen, nur um diese Website und TitanDesk zu betreiben, Zahlungen abzuwickeln und Ihnen unsere Antworten zu senden.'] },
        { heading: 'Ihre Rechte', body: ['Sie können Auskunft, Berichtigung oder Löschung Ihrer Daten verlangen, die Verarbeitung einschränken oder ihr widersprechen und Ihre Daten in einem übertragbaren Format erhalten. Außerdem können Sie sich bei einer Datenschutz-Aufsichtsbehörde beschweren. Schreiben Sie uns dazu an {email}.'] },
        { heading: 'Änderungen', body: ['Wenn sich ändert, was wir verarbeiten, aktualisieren wir diese Seite und ihr Datum.'] },
      ],
    },
    terms: {
      title: 'Nutzungsbedingungen',
      intro: 'Diese Bedingungen gelten für die Nutzung dieser Website. Für TitanDesk gelten die Nutzungsbedingungen für TitanDesk, für unsere Agenturleistungen der mit uns geschlossene Vertrag.',
      sections: [
        { heading: 'Nutzung dieser Website', body: ['Sie dürfen diese Website ansehen und ihre Formulare für echte Anfragen nutzen. Bitte missbrauchen Sie sie nicht, etwa durch Störversuche, unerlaubtes Testen (siehe unsere Seite Sicherheit zur Meldung von Problemen) oder Spam über die Formulare.'] },
        { heading: 'Informationen auf dieser Website', body: ['Wir halten die Informationen hier aktuell und korrekt, sie sind jedoch allgemeine Informationen, kein Angebot und keine Beratung. Preise und Funktionen von TitanDesk können sich ändern; maßgeblich sind die Bedingungen zum Zeitpunkt Ihres Abschlusses.'] },
        { heading: 'Geistiges Eigentum', body: ['Inhalte, Gestaltung und Code dieser Website gehören {controller} oder werden mit Erlaubnis verwendet. Produktnamen und Logos anderer Unternehmen gehören ihren Inhabern und werden nur genannt, um die Technologien zu beschreiben, mit denen wir arbeiten.'] },
        { heading: 'Links', body: ['Links zu anderen Websites dienen Ihrer Bequemlichkeit. Für deren Inhalte sind wir nicht verantwortlich.'] },
        { heading: 'Haftung', body: ['Wir haften unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie nach zwingendem Recht. Im Übrigen haften wir, soweit gesetzlich zulässig, nicht für Schäden aus der Nutzung dieser Website.'] },
        { heading: 'Kontakt', body: ['Fragen zu diesen Bedingungen: {email}.'] },
      ],
    },
    security: {
      title: 'Sicherheit & verantwortungsvolle Offenlegung',
      intro: 'Wir betreiben IT für andere Unternehmen und nehmen Hinweise zu unseren eigenen Systemen ernst. Wenn Sie glauben, eine Sicherheitslücke in dieser Website oder in TitanDesk gefunden zu haben, teilen Sie es uns bitte mit.',
      sections: [
        { heading: 'So melden Sie', body: ['Schreiben Sie an {email} mit dem Betreff „Security“ oder nutzen Sie „Sprechen Sie mit uns“ → „Problem melden“ → „Sicherheit“. Beschreiben Sie, was Sie gefunden haben, wo, und wie es sich nachvollziehen lässt.'] },
        { heading: 'Bitte', body: ['Testen Sie nur mit eigenen Konten und greifen Sie nicht auf mehr Daten zu, als zum Nachweis nötig ist. Keine Denial-of-Service-Tests, kein Social Engineering, keine physischen Angriffe. Geben Sie uns angemessen Zeit zur Behebung, bevor Sie etwas veröffentlichen.'] },
        { heading: 'Unsere Zusage', body: ['Wir bestätigen Meldungen möglichst innerhalb von drei Werktagen, halten Sie während der Behebung auf dem Laufenden und nennen Sie auf Wunsch. Gegen Forschung in gutem Glauben im Rahmen dieser Regeln gehen wir nicht rechtlich vor.'] },
        { heading: 'Wie wir Daten schützen', body: ['Die Anmeldung nutzt gehashte Passwörter, optionale Zwei-Faktor-Authentifizierung und Passkeys; Sitzungen nutzen sichere HTTP-only-Cookies; sensible Einstellungen wie KI-Schlüssel von Kunden und Zwei-Faktor-Geheimnisse werden verschlüsselt gespeichert; administrative Aktionen erfordern eine erneute Anmeldung und werden protokolliert; und unser Netzwerk-Gateway baut nur ausgehende Verbindungen auf, sodass Kunden keine eingehenden Firewall-Ports öffnen müssen.'] },
      ],
    },
    service: {
      title: 'Nutzungsbedingungen für TitanDesk',
      intro: 'Diese Bedingungen gelten, wenn Ihre Organisation einen TitanDesk-Workspace anlegt oder einen TitanDesk-Tarif bucht. Mit der Kontoerstellung akzeptieren Sie sie im Namen Ihrer Organisation. Ein mit uns unterzeichneter Enterprise-Vertrag hat bei Abweichungen Vorrang.',
      sections: [
        { heading: 'Der Dienst', body: ['TitanDesk ist ein Service Desk, den {controller} als über das Internet genutzte Software bereitstellt, zusammen mit dem optionalen Netzwerk-Gateway, das Sie in von Ihnen betreuten Netzen installieren. Wir können Funktionen verbessern und ändern; Kernfunktionen eines bezahlten Tarifs entfernen wir während eines bezahlten Zeitraums nicht ohne vorherige Ankündigung.'] },
        { heading: 'Ihr Konto', body: ['Ihre Angaben müssen zutreffen, und Anmeldedaten sind sicher aufzubewahren. Wer den Workspace anlegt, bestätigt, die Organisation an diese Bedingungen binden zu dürfen. Sie sind für Vorgänge in Ihrem Workspace und für eingeladene Nutzer verantwortlich und informieren uns umgehend unter {email}, wenn Sie einen unbefugten Zugriff vermuten.'] },
        { heading: 'Zulässige Nutzung', body: ['Nutzen Sie TitanDesk nicht für Rechtsverstöße, zum Speichern von Inhalten ohne Berechtigung, für Spam oder um Systeme anzugreifen oder zu testen, die Sie nicht betreuen dürfen. Installieren Sie das Gateway nur in Netzen, für die Sie verantwortlich sind, und führen Sie Diagnosen nur gegen Geräte aus, die Sie testen dürfen. Umgehen Sie keine Tariflimits, Sicherheitskontrollen oder die Trennung zwischen Workspaces.'] },
        { heading: 'Testphase, Tarife und Zahlung', body: ['Jeder neue Workspace startet mit 14 Tagen kostenloser Nutzung der Business-Funktionen, ohne Kreditkarte. Danach wählen Sie einen Tarif. Team und Business werden pro Nutzer monatlich im Voraus per Karte über Stripe abgerechnet; Enterprise wird gemäß Vertrag in Rechnung gestellt. Preise verstehen sich zuzüglich anfallender Umsatzsteuer. Preisänderungen kündigen wir mindestens 30 Tage vorher an; sie gelten ab Ihrem nächsten Abrechnungszeitraum.', 'Kündigungen und Erstattungen richten sich nach unserer Erstattungs- und Kündigungsrichtlinie.'] },
        { heading: 'Ihre Daten', body: ['Die Daten, die Ihre Organisation in TitanDesk speichert, bleiben Ihre. Wir nutzen sie nur, um den Dienst bereitzustellen, abzusichern und zu unterstützen, und handeln als Auftragsverarbeiter nach Art. 28 DSGVO: Wir verarbeiten sie nach Ihren dokumentierten Weisungen, behandeln sie vertraulich, schützen sie durch angemessene technische und organisatorische Maßnahmen, setzen Unterauftragsverarbeiter (etwa Hosting, E-Mail-Versand und Stripe) nur mit gleichwertigen Pflichten ein, unterstützen Sie bei Betroffenenanfragen, melden Datenschutzverletzungen unverzüglich und löschen oder übergeben die Daten bei Vertragsende. Enterprise-Kunden können einen gesonderten Auftragsverarbeitungsvertrag abschließen.', 'Solange Ihr Workspace aktiv ist, können Sie Ihre Daten exportieren. Wenn Sie TitanDesk nicht mehr nutzen, kann der Workspace-Inhaber unter {email} die Löschung verlangen; wir löschen die Daten innerhalb von 30 Tagen, ausgenommen gesetzlich aufzubewahrende Unterlagen.'] },
        { heading: 'Verfügbarkeit und Support', body: ['Wir arbeiten daran, TitanDesk verfügbar zu halten, und sichern Daten regelmäßig, garantieren bei Team und Business aber keine bestimmte Verfügbarkeit. Geplante Wartungen kündigen wir nach Möglichkeit an. Support erfolgt per E-Mail und in der App; Business wird bevorzugt behandelt. Verfügbarkeits- und Reaktionszusagen für Enterprise regelt der jeweilige Vertrag.'] },
        { heading: 'Sperrung und Kündigung', body: ['Sie können jederzeit in den Abrechnungseinstellungen kündigen. Wir können einen Workspace sperren, wenn Zahlungen trotz Mahnung ausbleiben, oder sofort, wenn er unter schwerem Verstoß gegen diese Bedingungen genutzt wird oder andere Kunden oder den Dienst gefährdet; wir nennen den Grund und stellen den Zugang wieder her, sobald das Problem behoben ist. Beide Seiten können bei einem wesentlichen Verstoß kündigen, der nicht innerhalb von 14 Tagen nach Mitteilung behoben wird.'] },
        { heading: 'Haftung', body: ['Wir haften unbeschränkt bei Vorsatz, grober Fahrlässigkeit, Verletzung von Leben, Körper oder Gesundheit sowie nach zwingendem Recht. Bei leichter Fahrlässigkeit haften wir nur für die Verletzung wesentlicher Vertragspflichten und begrenzt auf den vertragstypischen, vorhersehbaren Schaden, insgesamt höchstens auf die in den 12 Monaten vor dem Ereignis gezahlten Entgelte. Für Schäden durch von Ihnen betreute Netze oder Geräte oder durch verbundene Drittdienste wie Ihren KI-Anbieter haften wir nicht.'] },
        { heading: 'Änderungen dieser Bedingungen', body: ['Ändern wir diese Bedingungen, informieren wir Workspace-Inhaber mindestens 30 Tage vorher per E-Mail. Sind Sie nicht einverstanden, können Sie vor Inkrafttreten kündigen.'] },
        { heading: 'Recht und Kontakt', body: ['Es gilt das Recht des Landes, in dem {controller} eingetragen ist, unbeschadet zwingender Verbraucher- und Datenschutzvorschriften. Fragen: {email}.'] },
      ],
    },
    refunds: {
      title: 'Erstattungs- und Kündigungsrichtlinie',
      intro: 'So funktionieren Testphase, Kündigung und Erstattung bei TitanDesk. Für unsere Agenturleistungen (Managed IT, Projekte) gilt der Vertrag bzw. das Angebot, das Sie mit uns abschließen.',
      sections: [
        { heading: 'Kostenlose Testphase', body: ['Jeder neue Workspace erhält 14 Tage kostenlos die Business-Funktionen, ohne hinterlegte Karte, es gibt also nichts zu erstatten. Nach der Testphase werden die reinen Business-Funktionen deaktiviert, bis Sie einen Tarif wählen. Ihre Daten bleiben erhalten.'] },
        { heading: '30-Tage-Geld-zurück-Garantie', body: ['Passt TitanDesk nicht zu Ihnen, können Sie innerhalb von 30 Tagen nach Ihrer ersten Zahlung eine volle Erstattung verlangen. Nutzen Sie „Erstattung anfordern“ unter Einstellungen → Abrechnung oder schreiben Sie an {email}. Wir erstatten Ihre letzte Zahlung vollständig und beenden das Abonnement sofort. Die Garantie gilt für die ersten 30 Tage nach dem erstmaligen Abschluss; Kündigen und erneutes Abschließen startet sie nicht neu.'] },
        { heading: 'Kündigung', body: ['Sie können jederzeit unter Einstellungen → Abrechnung kündigen. Ihr Tarif bleibt bis zum Ende des bereits bezahlten Zeitraums aktiv, und es erfolgt keine weitere Abbuchung. Teilweise genutzte Abrechnungszeiträume erstatten wir außerhalb der 30-Tage-Garantie nicht.'] },
        { heading: 'Tarifwechsel', body: ['Unter Einstellungen → Abrechnung können Sie zwischen Team und Business wechseln. Zahlen Sie bereits per Karte, erfolgt der Wechsel im bestehenden Abonnement, und Stripe verrechnet den Rest des laufenden Zeitraums anteilig, sodass nie doppelt abgebucht wird.'] },
        { heading: 'Enterprise', body: ['Enterprise wird nach einem unterzeichneten Vertrag abgerechnet. Laufzeit, Kündigungsfrist und etwaige Erstattungen regelt dieser Vertrag. Wechselt ein Workspace zu Enterprise, wird ein bestehendes Kartenabonnement beendet und die bereits bezahlte Restlaufzeit auf der ersten Rechnung gutgeschrieben.'] },
        { heading: 'Fehlgeschlagene Zahlungen', body: ['Schlägt eine Zahlung fehl, versucht Stripe sie automatisch erneut, und Ihr Tarif wird unter Einstellungen → Abrechnung als überfällig angezeigt, wo Sie Ihre Karte aktualisieren können. Lässt sie sich weiterhin nicht einziehen, endet das Abonnement und die reinen Business-Funktionen werden deaktiviert. Wegen einer fehlgeschlagenen Zahlung löschen wir keine Daten.'] },
        { heading: 'Ihre gesetzlichen Rechte', body: ['Diese Richtlinie schränkt Ihre Rechte nach zwingendem Recht nicht ein. Glauben Sie, dass wir Ihnen versehentlich etwas berechnet haben, schreiben Sie an {email}; wir prüfen das innerhalb von fünf Werktagen.'] },
      ],
    },
    imprint: {
      title: 'Impressum',
      intro: 'Angaben zum Betreiber dieser Website.',
      labels: { name: 'Betreiber', address: 'Anschrift', representative: 'Vertreten durch', email: 'E-Mail', phone: 'Telefon', registration: 'Registereintrag', vatId: 'USt-IdNr.' },
      missing: 'Weitere Unternehmensangaben werden ergänzt.',
    },
  },
};
