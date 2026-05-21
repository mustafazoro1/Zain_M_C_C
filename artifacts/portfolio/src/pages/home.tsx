import { useListFeaturedProjects } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { PageTransition } from "@/components/ui/PageTransition";
import { useState } from "react";
import { ProjectSummary } from "@workspace/api-client-react/src/generated/api.schemas";

// Fallback images we generated if heroImage is missing
const fallbackImages = [
  "/images/arch-tower.png",
  "/images/arch-cultural.png",
  "/images/arch-civic.png",
  "/images/arch-interior.png",
  "/images/arch-pavilion.png",
];

export default function Home() {
  const { data: featuredProjects = [], isLoading } = useListFeaturedProjects();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  // Ensure we have at least 5 projects for the accordion, repeat if necessary
  const displayProjects =
    featuredProjects.length > 0
      ? featuredProjects.slice(0, 5)
      : [
          { id: 1, title: "The Obsidian Tower", slug: "obsidian-tower", location: "New York", heroImage: fallbackImages[0] },
          { id: 2, title: "Cultural Center", slug: "cultural-center", location: "London", heroImage: fallbackImages[1] },
          { id: 3, title: "Civic Pavilion", slug: "civic-pavilion", location: "Tokyo", heroImage: fallbackImages[2] },
          { id: 4, title: "National Gallery", slug: "national-gallery", location: "Paris", heroImage: fallbackImages[3] },
          { id: 5, title: "Horizon Building", slug: "horizon-building", location: "Dubai", heroImage: fallbackImages[4] },
        ] as any[];

  return (
    <PageTransition>
      <div className="bg-black min-h-screen text-white">
        {/* Full-screen Accordion */}
        <section className="h-screen w-full flex overflow-hidden bg-black">
          {displayProjects.map((project, i) => {
            const isHovered = hoveredIndex === i;
            const flexValue = hoveredIndex === null ? 1 : isHovered ? 4 : 0.5;

            return (
              <motion.div
                key={project.id}
                className="relative h-full border-r border-white/10 group cursor-pointer overflow-hidden"
                animate={{ flex: flexValue }}
                transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                data-cursor-expand
              >
                <Link href={`/projects/${project.slug}`} className="block w-full h-full relative">
                  {/* Background Image */}
                  <motion.div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
                    style={{ backgroundImage: `url(${project.heroImage || fallbackImages[i % fallbackImages.length]})` }}
                    animate={{ scale: isHovered ? 1.05 : 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-700 z-10" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-8">
                    <motion.div
                      animate={{
                        opacity: isHovered || hoveredIndex === null ? 1 : 0,
                        y: isHovered ? 0 : 20,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <p className="text-sm tracking-[0.2em] text-white/70 uppercase mb-2">
                        {project.location || "Global"}
                      </p>
                      <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold tracking-tighter uppercase whitespace-nowrap overflow-hidden text-ellipsis">
                        {project.title}
                      </h2>
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </section>

        {/* Featured Projects Grid */}
        <section className="py-32 px-6 max-w-screen-2xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-serif font-bold tracking-tighter uppercase mb-16"
          >
            Selected Works
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                data-cursor-expand
              >
                <Link href={`/projects/${project.slug}`} className="block group">
                  <div className="aspect-[4/5] relative overflow-hidden bg-neutral-900 mb-6">
                    <motion.div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${project.heroImage || fallbackImages[i % fallbackImages.length]})` }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-serif tracking-tighter uppercase mb-2">{project.title}</h3>
                      <p className="text-sm text-neutral-500">{project.location}</p>
                    </div>
                    <p className="text-sm text-neutral-500 uppercase tracking-widest">{project.sector}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
