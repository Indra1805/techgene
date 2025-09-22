import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
              Techgene
        </Link>
        <ul className="flex space-x-6">
          <li>
            <Link href="/about" className="text-gray-700 hover:text-blue-600">
              About
            </Link>
          </li>
          <li>
            <Link href="/courses" className="text-gray-700 hover:text-blue-600">
              Courses
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600">
              Contact
            </Link>
          </li>
          <li>
            <Link
              href="/otp"
              className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
            >
              Get Started
            </Link>
          </li>
          <li>
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
