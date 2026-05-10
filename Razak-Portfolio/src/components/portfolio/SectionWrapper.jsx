import { motion } from "framer-motion";

export default function SectionWrapper({ children, id, className = "" }) {
    return (
        <motion.section
            id={id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`relative py-24 px-4 sm:px-6 lg:px-8 z-10 ${className}`}
        >
            <div className="max-w-7xl mx-auto">
                {children}
            </div>
        </motion.section>
    );
}