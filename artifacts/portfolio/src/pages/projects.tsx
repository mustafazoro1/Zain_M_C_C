import { useListProjects, useListCategories } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { PageTransition } from "@/components/ui/PageTransition";
import { useState } from "react";

const fallbackImage = "/images/arch-cultural.png";

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
  const { data: categories = [] } = useListCategories();
  const { data: projects = [], isLoading } = useListProjects({ published: true });

  const filteredProjects = selectedCategory 
    ? projects.filter(p => p.categoryId === selectedCategory)
    : projects;

  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white px-6 py-12 max-w-screen-2xl mx-auto">
        <header className="mb-20 mt-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-serif font-bold tracking-tighter uppercase mb-12"
          >
            Selected Works
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-6 border-t border-b border-white/10 py-6"
          >
            <button
              onClick={() => setSelectedCategory(null)}
              className={`text-sm tracking-widest uppercase transition-opacity ${
                selectedCategory === null ? "opacity-100 font-bold" : "opacity-40 hover:opacity-80"
              }`}
              data-cursor-expand
            >
              All Projects
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-sm tracking-widest uppercase transition-opacity ${
                  selectedCategory === cat.id ? "opacity-100 font-bold" : "opacity-40 hover:opacity-80"
                }`}
                data-cursor-expand
              >
                {cat.name}
              </button>
            ))}
          </motion.div>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                data-cursor-expand
              >
                <Link href={`/projects/${project.slug}`} className="block group">
                  <div className="aspect-[4/5] relative overflow-hidden bg-neutral-900 mb-6">
                    <motion.div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${project.heroImage || fallbackImage})` }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-serif tracking-tighter uppercase mb-2 group-hover:text-neutral-300 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-neutral-500">{project.location}</p>
                    </div>
                    <p className="text-xs text-neutral-500 uppercase tracking-widest">
                      {project.year || "Ongoing"}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
            
            {filteredProjects.length === 0 && (
              <div className="col-span-full py-20 text-center text-neutral-500">
                No projects found for this category.
              </div>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
