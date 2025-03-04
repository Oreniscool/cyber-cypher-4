"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/language-context"
import { translations } from "@/lib/translations"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

export default function Pricing() {
  const { language } = useLanguage()
  const t = translations[language]

  const plans = [
    {
      name: t.pricing.plans[0].name,
      price: t.pricing.plans[0].price,
      description: t.pricing.plans[0].description,
      features: t.pricing.plans[0].features,
      cta: t.pricing.plans[0].cta,
      popular: false,
    },
    {
      name: t.pricing.plans[1].name,
      price: t.pricing.plans[1].price,
      description: t.pricing.plans[1].description,
      features: t.pricing.plans[1].features,
      cta: t.pricing.plans[1].cta,
      popular: true,
    },
    {
      name: t.pricing.plans[2].name,
      price: t.pricing.plans[2].price,
      description: t.pricing.plans[2].description,
      features: t.pricing.plans[2].features,
      cta: t.pricing.plans[2].cta,
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold">{t.pricing.title}</h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-[800px] mx-auto">{t.pricing.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-xl p-6 shadow-md border ${
                plan.popular ? "border-primary bg-primary/5" : "border-border bg-background"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  <div className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    {t.pricing.popularBadge}
                  </div>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="ml-1 text-muted-foreground">/{t.pricing.perMonth}</span>
                </div>
                <p className="mt-2 text-muted-foreground">{plan.description}</p>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                  {plan.cta}
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

