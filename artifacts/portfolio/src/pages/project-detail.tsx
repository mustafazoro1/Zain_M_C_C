import { useGetProject } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { useRef } from "react";
import { getGetProjectQueryKey } from "@workspace/api-client-react";

export default function ProjectDetail() {
  const params = useParams();
  const slug = params.slug || "";
  
  const { data: project, isLoading } = useGetProject(slug, { 
    query: { enabled: !!slug, queryKey: getGetProjectQueryKey(slug) } 
  });

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <h1 className="text-2xl font-serif">Project not found</h1>
      </div>
    );
  }

  const metadata = [
    { label: "Location", value: project.location },
    { label: "Client", value: project.client },
    { label: "Sector", value: project.sector },
    { label: "Size", value: project.size },
    { label: "Scope", value: project.scope },
    { label: "Status", value: project.status },
    { label: "Year", value: project.year },
  ].filter(m => m.value);

  const fallbackImage = "/images/arch-civic.png";

  return (
    <PageTransition>
      <div className="bg-black min-h-screen text-white">
        {/* Section A: Hero */}
        <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${project.heroImage || fallbackImage})`,
              y,
              opacity
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-end pb-20 px-6 max-w-screen-2xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-8xl lg:text-9xl font-serif font-bold tracking-tighter uppercase"
            >
              {project.title}
            </motion.h1>
          </div>
        </section>

        {/* Section B: Metadata + Narrative */}
        <section className="py-32 px-6 max-w-screen-2xl mx-auto border-b border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="lg:col-span-4"
            >
              <h3 className="text-sm tracking-widest uppercase text-neutral-500 mb-8 border-b border-white/10 pb-4">Fact Sheet</h3>
              <ul className="space-y-6">
                {metadata.map((item, i) => (
                  <li key={i} className="flex flex-col">
                    <span className="text-xs tracking-widest uppercase text-neutral-500">{item.label}</span>
                    <span className="text-lg font-serif">{item.value}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-8 lg:col-start-6"
            >
              <h3 className="text-sm tracking-widest uppercase text-neutral-500 mb-8 border-b border-white/10 pb-4">Narrative</h3>
              <div className="prose prose-invert prose-lg max-w-none">
                {project.longDescription ? (
                  project.longDescription.split('\n\n').map((para, i) => (
                    <p key={i} className="text-xl leading-relaxed text-neutral-300 font-light mb-6">{para}</p>
                  ))
                ) : (
                  <p className="text-xl leading-relaxed text-neutral-300 font-light">
                    Concept details and narrative documentation forthcoming.
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section C: Masonry Images */}
        {project.images && project.images.length > 0 && (
          <section className="py-32 px-6 max-w-screen-2xl mx-auto">
            <div className="columns-1 md:columns-2 gap-8 space-y-8">
              {project.images.sort((a, b) => a.sortOrder - b.sortOrder).map((img, i) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="break-inside-avoid overflow-hidden bg-neutral-900"
                >
                  <img 
                    src={img.imageUrl} 
                    alt={`${project.title} detail`}
                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageTransition>
  );
}
