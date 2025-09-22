"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Illustration */}
      <section className="relative bg-blue-600 text-white py-32 px-6 sm:px-12 overflow-hidden">
        {/* Background Illustration */}
        <div className="absolute inset-0">
          <img
            src="https://plus.unsplash.com/premium_photo-1683121710572-7723bd2e235d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTA2fHx0ZWNofGVufDB8fDB8fHww"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 animate-fadeInUp">
            Learn New Skills Online
          </h1>
          <p className="text-lg sm:text-xl mb-8 animate-fadeInUp delay-200">
            Explore our collection of high-quality courses and grow your knowledge
            at your own pace.
          </p>
          <Link href="/courses" className="inline-block animate-fadeInUp delay-400">
            <button className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg shadow-lg
              hover:bg-gray-100 transition transform hover:scale-105">
              Explore Courses
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Expert Instructors",
              desc: "Learn from industry experts with years of experience.",
            },
            {
              title: "Flexible Learning",
              desc: "Study anytime, anywhere at your own pace with our courses.",
            },
            {
              title: "Community Support",
              desc: "Join our active community and get help when you need it.",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition transform hover:scale-105 animate-fadeInUp"
              style={{ animationDelay: `${idx * 200}ms` }}
            >
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-700">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-50 py-16 px-6 sm:px-12 text-center">
        <h2 className="text-3xl font-bold mb-4 animate-fadeInUp">Ready to Start Learning?</h2>
        <p className="text-gray-700 mb-6 animate-fadeInUp delay-200">
          Browse our courses and take the first step towards mastering new skills.
        </p>
        <Link href="/courses">
          <button className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg
            hover:bg-blue-700 transition transform hover:scale-105 animate-fadeInUp delay-400">
            View Courses
          </button>
        </Link>
      </section>
    </div>
  );
}
