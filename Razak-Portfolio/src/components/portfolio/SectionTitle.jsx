import { motion } from "framer-motion";

export default function SectionTitle({ title, subtitle, mono = "" }) {
    return (
        <div className="mb-14">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 mb-3"
            >
                <div className="h-px w-8 bg-primary/60" />
                <span className="font-mono text-xs text-primary/70 tracking-widest uppercase">
                    {mono || title.toLowerCase().replace(/\s+/g, "_")}
                </span>
            </motion.div>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-space text-3xl sm:text-5xl font-extrabold text-foreground leading-tight"
            >
                {title}
            </motion.h2>
            {subtitle && (
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-muted-foreground mt-2 text-base max-w-2xl"
                >
                    {subtitle}
                </motion.p>
            )}
        </div>
    );
}