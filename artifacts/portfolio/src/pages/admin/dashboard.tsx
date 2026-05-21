import { AdminLayout } from "@/components/layout/AdminLayout";
import { useListProjects, useToggleProjectPublish, getListProjectsQueryKey, useAdminLogout } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminDashboard() {
  const { data: projects = [], isLoading } = useListProjects();
  const togglePublish = useToggleProjectPublish();
  const logout = useAdminLogout();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const handleToggle = (id: number, published: boolean) => {
    togglePublish.mutate(
      { id, data: { published } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
        }
      }
    );
  };

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => setLocation("/admin")
    });
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-end mb-12 border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-4xl font-serif tracking-tighter uppercase mb-2">Projects</h1>
          <p className="text-neutral-500 tracking-widest text-sm uppercase">Content Management</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleLogout}
            className="px-6 py-2 border border-neutral-800 hover:border-neutral-600 transition-colors uppercase tracking-widest text-xs"
          >
            Sign Out
          </button>
          <Link 
            href="/admin/projects/new"
            className="px-6 py-2 bg-white text-black hover:bg-neutral-200 transition-colors uppercase tracking-widest text-xs font-medium"
          >
            New Project
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="animate-pulse flex space-y-4 flex-col">
          {[1,2,3].map(i => <div key={i} className="h-16 bg-neutral-900 w-full" />)}
        </div>
      ) : (
        <div className="bg-neutral-950 border border-neutral-800 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900 text-xs tracking-widest uppercase text-neutral-400">
                <th className="p-4 font-normal">Title</th>
                <th className="p-4 font-normal">Location</th>
                <th className="p-4 font-normal">Status</th>
                <th className="p-4 font-normal">Visibility</th>
                <th className="p-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-neutral-800/50 hover:bg-neutral-900/50 transition-colors">
                  <td className="p-4">
                    <span className="font-serif text-lg">{project.title}</span>
                    <div className="text-xs text-neutral-500 uppercase tracking-wider">{project.sector}</div>
                  </td>
                  <td className="p-4 text-neutral-400">{project.location || "—"}</td>
                  <td className="p-4 text-neutral-400">{project.status}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggle(project.id, !project.published)}
                      disabled={togglePublish.isPending}
                      className={`text-xs px-3 py-1 uppercase tracking-widest border ${
                        project.published 
                          ? "border-green-900 text-green-500 hover:border-green-700" 
                          : "border-neutral-700 text-neutral-500 hover:border-neutral-500 hover:text-neutral-300"
                      }`}
                    >
                      {project.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-4">
                    <Link 
                      href={`/admin/projects/${project.id}/images`}
                      className="text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
                    >
                      Images
                    </Link>
                    <Link 
                      href={`/admin/projects/${project.id}/edit`}
                      className="text-xs uppercase tracking-widest text-white hover:text-neutral-300 transition-colors"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-500 tracking-widest uppercase text-sm">
                    No projects found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
