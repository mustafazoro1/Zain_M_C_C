import { useListProjects, useListCategories } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { PageTransition } from "@/components/ui/PageTransition";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const { data: categories = [] } = useListCategories();
  const { data: projects = [], isLoading } = useListProjects({ published: true });

  const filteredProjects = selectedCategory
    ? projects.filter(p => p.categoryId === selectedCategory)
    : projects;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground">
        <div className="px-6 max-w-screen-2xl mx-auto">
          {/* Header */}
          <header className="mb-16 mt-6">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] tracking-[0.4em] uppercase text-[hsl(38,72%,52%)] mb-3"
            >
              Portfolio
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-serif font-bold tracking-tight uppercase mb-10"
            >
              All Projects
            </motion.h1>

            {/* Category filter bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="flex flex-wrap items-center gap-2 border-t border-b border-[hsl(220,15%,18%)] py-4"
            >
              <SlidersHorizontal size={12} className="text-[hsl(220,12%,45%)] mr-2 shrink-0" />
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase transition-all ${
                  selectedCategory === null
                    ? "bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] font-bold"
                    : "border border-[hsl(220,15%,22%)] text-[hsl(220,12%,55%)] hover:border-[hsl(38,72%,52%)/50%] hover:text-foreground"
                }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase transition-all ${
                    selectedCategory === cat.id
                      ? "bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] font-bold"
                      : "border border-[hsl(220,15%,22%)] text-[hsl(220,12%,55%)] hover:border-[hsl(38,72%,52%)/50%] hover:text-foreground"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
              <span className="ml-auto text-xs text-[hsl(220,12%,40%)]">
                {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}
              </span>
            </motion.div>
          </header>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-[hsl(220,18%,12%)] mb-4" />
                  <div className="h-4 bg-[hsl(220,15%,15%)] w-2/3 mb-2" />
                  <div className="h-3 bg-[hsl(220,15%,13%)] w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 pb-24">
              {filteredProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  data-testid={`card-project-${project.id}`}
                >
                  <Link href={`/projects/${project.slug}`} className="block group">
                    <div className="aspect-[4/3] relative overflow-hidden bg-[hsl(220,18%,12%)] mb-5 border border-[hsl(220,15%,18%)] group-hover:border-[hsl(38,72%,52%)/40%] transition-colors duration-300">
                      {project.heroImage ? (
                        <motion.div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${project.heroImage})` }}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-end p-5 bg-gradient-to-br from-[hsl(220,18%,14%)] to-[hsl(220,18%,9%)]">
                          <span className="text-sm font-serif uppercase text-[hsl(220,12%,40%)]">{project.title}</span>
                        </div>
                      )}
                      {/* Sector badge */}
                      {project.sector && (
                        <span className="absolute top-3 left-3 text-[9px] tracking-[0.2em] uppercase bg-[hsl(220,18%,9%)/80%] text-[hsl(38,72%,52%)] px-2.5 py-1 backdrop-blur-sm">
                          {project.sector}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-serif font-bold tracking-tight uppercase mb-1 group-hover:text-[hsl(38,72%,52%)] transition-colors duration-200">
                          {project.title}
                        </h3>
                        <p className="text-xs text-[hsl(220,12%,50%)]">{project.location}</p>
                      </div>
                      <p className="text-xs text-[hsl(220,12%,40%)]">{project.year || "Ongoing"}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}

              {filteredProjects.length === 0 && (
                <div className="col-span-full py-24 text-center">
                  <p className="text-[hsl(220,12%,45%)] text-sm tracking-widest uppercase">No projects in this category</p>
                </div>
              )}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
}
