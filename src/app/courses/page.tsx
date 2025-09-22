import { supabaseServer } from "@/lib/supabaseServer";

type Course = {
  id: string;
  title: string;
  description: string;
  image_url?: string;
};

export default async function CoursesPage() {
  const { data: courses, error } = await supabaseServer
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <p className="text-center mt-8 text-red-600">
        Error loading courses: {error.message}
      </p>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <p className="text-center mt-8 text-gray-600">No courses available.</p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
        Available Courses
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course: Course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
          >
            {course.image_url && (
              <img
                src={course.image_url}
                alt={course.title}
                className="w-full h-48 object-cover transition-transform duration-300"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
              <p className="text-gray-700">{course.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
