"use client"

import { useLanguage } from "@/context/language-context"
import { translations } from "@/lib/translations"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

export default function HowItWorks() {
  const { language } = useLanguage()
  const t = translations[language]

  const steps = [
    {
      number: "01",
      title: t.howItWorks.steps[0].title,
      description: t.howItWorks.steps[0].description,
    },
    {
      number: "02",
      title: t.howItWorks.steps[1].title,
      description: t.howItWorks.steps[1].description,
    },
    {
      number: "03",
      title: t.howItWorks.steps[2].title,
      description: t.howItWorks.steps[2].description,
    },
    {
      number: "04",
      title: t.howItWorks.steps[3].title,
      description: t.howItWorks.steps[3].description,
    },
  ]

  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold">{t.howItWorks.title}</h2>
            <p className="text-xl text-muted-foreground">{t.howItWorks.subtitle}</p>

            <div className="space-y-8 mt-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-xl overflow-hidden shadow-2xl"
          >
            <div className="aspect-video relative">
              <img
                src="/placeholder.svg?height=720&width=1280"
                alt="VoiceConnect in action"
                className="w-full h-full object-cover"
              />

              {/* Overlay with features */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-xl font-bold mb-4">{t.howItWorks.demoTitle}</h3>
                <div className="space-y-2">
                  {t.howItWorks.demoFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      <span className="text-white">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

