"use client"

import Link from "next/link"
import { useLanguage } from "@/context/language-context"
import { translations } from "@/lib/translations"

export default function Footer() {
  const { language } = useLanguage()
  const t = translations[language]

  const footerLinks = [
    {
      title: t.footer.company,
      links: [
        { label: t.footer.about, href: "#" },
        { label: t.footer.careers, href: "#" },
        { label: t.footer.blog, href: "#" },
      ],
    },
    {
      title: t.footer.product,
      links: [
        { label: t.footer.features, href: "#features" },
        { label: t.footer.pricing, href: "#pricing" },
        { label: t.footer.faq, href: "#" },
      ],
    },
    {
      title: t.footer.resources,
      links: [
        { label: t.footer.documentation, href: "#" },
        { label: t.footer.guides, href: "#" },
        { label: t.footer.support, href: "#contact" },
      ],
    },
    {
      title: t.footer.legal,
      links: [
        { label: t.footer.privacy, href: "#" },
        { label: t.footer.terms, href: "#" },
        { label: t.footer.cookies, href: "#" },
      ],
    },
  ]

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                VoiceConnect
              </span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-xs">{t.footer.description}</p>
          </div>

          {footerLinks.map((group, index) => (
            <div key={index} className="space-y-4">
              <h3 className="font-medium text-lg">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} VoiceConnect. {t.footer.allRightsReserved}
          </p>

          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-muted-foreground hover:text-primary">
              Twitter
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              LinkedIn
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              Facebook
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              Instagram
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

