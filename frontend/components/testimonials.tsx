"use client"

import { useLanguage } from "@/context/language-context"
import { translations } from "@/lib/translations"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { useState } from "react"

export default function Testimonials() {
  const { language } = useLanguage()
  const t = translations[language]
  const [activeIndex, setActiveIndex] = useState(0)

  const testimonials = t.testimonials.items

  return (
    <section id="testimonials" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold">{t.testimonials.title}</h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-[800px] mx-auto">{t.testimonials.subtitle}</p>
        </motion.div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="bg-background rounded-xl p-8 shadow-md border border-border max-w-4xl mx-auto">
                    <div className="flex items-center mb-6">
                      <div className="flex-shrink-0 mr-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden">
                          <img
                            src={`/placeholder.svg?height=200&width=200&text=${testimonial.name.charAt(0)}`}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                        <p className="text-muted-foreground">{testimonial.role}</p>
                        <div className="flex mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <blockquote className="text-lg italic">"{testimonial.quote}"</blockquote>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  activeIndex === index ? "bg-primary" : "bg-muted-foreground/30"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

