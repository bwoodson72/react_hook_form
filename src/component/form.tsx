'use client'

import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "motion/react";

const schema = z.object({
  firstName: z.string().min(2, "Name required."),
  lastName: z.string().min(2, "Name required."),
  email: z.string().email("Invalid email address."),
  message: z.string().min(10, "Please provide more details."),
});

type Inputs = z.infer<typeof schema>;

export default function ProfessionalContactDemo() {
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("%c DEMO DATA RECEIVED ", "background: #3b82f6; color: #fff; font-weight: bold;");
    console.table(data);
    setIsSuccess(true);
    reset(); // Properly clears form fields
  };

  const shakeVariants = {
    error: { x: [0, -4, 4, -4, 4, 0], transition: { duration: 0.4 } }
  };

  const inputStyles = (fieldName: keyof Inputs) => `
    w-full bg-white/5 border py-3 px-4 text-base text-white rounded-xl
    placeholder:text-white/20 focus:outline-none transition-all duration-300
    ${errors[fieldName] ? "border-red-500/50 bg-red-500/5" : "border-white/10 focus:border-blue-500"}
  `;

  return (
      <section id="contact-demo" className="relative min-h-screen w-full flex items-center justify-center px-6 py-24 bg-black overflow-hidden font-sans">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">

          {/* Left Side: Technical Narrative (Restored) */}
          <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-10"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/5 mb-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Interactive Tech Demo</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white uppercase leading-[0.9]">
                Technical <br />
                <span className="text-blue-500">Implementation.</span>
              </h2>
            </div>

            <div className="space-y-8">
              <p className="text-white/70 text-lg leading-relaxed max-w-lg">
                This exhibit demonstrates a production-grade form architecture. It utilizes **Zod** for schema-based validation and **React Hook Form** for optimized, non-re-rendering state management.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="space-y-1 p-4 border border-white/5 bg-white/[0.02] rounded-2xl">
                  <span className="text-blue-400 font-mono text-[10px] uppercase tracking-widest">01 / Validation</span>
                  <p className="text-sm text-white/90 font-medium">Real-time Schema Logic</p>
                </div>
                <div className="space-y-1 p-4 border border-white/5 bg-white/[0.02] rounded-2xl">
                  <span className="text-blue-400 font-mono text-[10px] uppercase tracking-widest">02 / UX</span>
                  <p className="text-sm text-white/90 font-medium">Async Submit Handling</p>
                </div>
              </div>

              <div className="mt-8 p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 text-yellow-200/60 text-xs italic leading-relaxed">
                Note: This is a simulation. Submitting this form logs the payload to the developer console for inspection and does not trigger a production email flow.
              </div>
            </div>
          </motion.div>

          {/* Right Side: The Form */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                  <motion.div
                      key="demo-form"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.4 }}
                  >
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="bg-[#0c0c0c] border border-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative"
                        noValidate
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div animate={errors.firstName ? "error" : ""} variants={shakeVariants} className="space-y-2">
                          <label className="text-xs uppercase tracking-widest text-blue-400 font-bold ml-1">First Name</label>
                          <input {...register("firstName")} className={inputStyles("firstName")} placeholder="Brian" />
                          {errors.firstName && <p className="text-[10px] text-red-500 font-mono mt-1 ml-1">{errors.firstName.message}</p>}
                        </motion.div>
                        <motion.div animate={errors.lastName ? "error" : ""} variants={shakeVariants} className="space-y-2">
                          <label className="text-xs uppercase tracking-widest text-blue-400 font-bold ml-1">Last Name</label>
                          <input {...register("lastName")} className={inputStyles("lastName")} placeholder="Woodson" />
                          {errors.lastName && <p className="text-[10px] text-red-500 font-mono mt-1 ml-1">{errors.lastName.message}</p>}
                        </motion.div>
                        <motion.div animate={errors.email ? "error" : ""} variants={shakeVariants} className="md:col-span-2 space-y-2">
                          <label className="text-xs uppercase tracking-widest text-blue-400 font-bold ml-1">Email</label>
                          <input {...register("email")} className={inputStyles("email")} placeholder="demo@example.io" />
                          {errors.email && <p className="text-[10px] text-red-500 font-mono mt-1 ml-1">{errors.email.message}</p>}
                        </motion.div>
                        <motion.div animate={errors.message ? "error" : ""} variants={shakeVariants} className="md:col-span-2 space-y-2">
                          <label className="text-xs uppercase tracking-widest text-blue-400 font-bold ml-1">Message</label>
                          <textarea {...register("message")} rows={4} className={`${inputStyles("message")} resize-none`} placeholder="Test the validation logic..." />
                          {errors.message && <p className="text-[10px] text-red-500 font-mono mt-1 ml-1">{errors.message.message}</p>}
                        </motion.div>
                      </div>

                      <button
                          disabled={isSubmitting}
                          className="mt-10 w-full py-5 bg-blue-600 text-white font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-blue-500 transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20"
                      >
                        {isSubmitting ? "Running Test..." : "Submit Tech Demo"}
                      </button>
                    </form>
                  </motion.div>
              ) : (
                  <motion.div
                      key="demo-success"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-[#0c0c0c] border border-white/5 p-16 rounded-[2.5rem] text-center space-y-6 min-h-[500px] flex flex-col justify-center items-center"
                  >
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20 mb-4">
                      <span className="text-blue-400 text-2xl">✓</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white uppercase italic">Valid <span className="text-blue-500 not-italic">Payload.</span></h2>
                    <p className="text-white/60 text-lg leading-relaxed max-w-sm">Schema check passed. Open the developer console to inspect the logged object.</p>
                    <button onClick={() => setIsSuccess(false)} className="text-blue-400 underline uppercase tracking-widest text-sm pt-4 hover:text-white transition-colors">Restart Demo</button>
                  </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
  );
}