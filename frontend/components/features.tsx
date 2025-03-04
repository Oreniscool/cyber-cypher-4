"use client"

import { useLanguage } from "@/context/language-context"
import { translations } from "@/lib/translations"
import { motion } from "framer-motion"
import { MessageSquare, Languages, ClipboardList, Bell, BrainCircuit, Calendar } from "lucide-react"

export default function Features() {
  const { language } = useLanguage()
  const t = translations[language]

  const features = [
    {
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      title: t.features.items[0].title,
      description: t.features.items[0].description,
    },
    {
      icon: <Languages className="h-10 w-10 text-primary" />,
      title: t.features.items[1].title,
      description: t.features.items[1].description,
    },
    {
      icon: <ClipboardList className="h-10 w-10 text-primary" />,
      title: t.features.items[2].title,
      description: t.features.items[2].description,
    },
    {
      icon: <Bell className="h-10 w-10 text-primary" />,
      title: t.features.items[3].title,
      description: t.features.items[3].description,
    },
    {
      icon: <BrainCircuit className="h-10 w-10 text-primary" />,
      title: t.features.items[4].title,
      description: t.features.items[4].description,
    },
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: t.features.items[5].title,
      description: t.features.items[5].description,
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold">{t.features.title}</h2>
            <p className="mt-4 text-xl text-muted-foreground max-w-[800px] mx-auto">{t.features.subtitle}</p>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-background rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-border"
            >
              <div className="mb-4 rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

