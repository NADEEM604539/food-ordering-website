import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#0d0d0d] border-t border-[#1a1a1a] text-gray-400 text-sm py-10 mt-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Branding Section */}
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide mb-2">🍽️ NADEEM FOODS</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Delivering authentic taste with passion. Enjoy fast, fresh, and flavorful food from the comfort of your home.
          </p>
        </div>

        {/* Links Section */}
        <div className="flex flex-col gap-2 md:items-center">
          <h3 className="text-orange-400 text-sm font-semibold mb-2">Quick Links</h3>
          <a href="/privacy" className="hover:text-orange-500 transition duration-200">Privacy Policy</a>
          <a href="/terms" className="hover:text-orange-500 transition duration-200">Terms & Conditions</a>
        </div>

        {/* Social Section */}
        <div className="flex flex-col md:items-end">
          <h3 className="text-orange-400 text-sm font-semibold mb-2">Follow Us</h3>
          <div className="flex gap-4 text-lg">
            <a href="https://www.facebook.com/profile.php?id=100084456821594" className="hover:text-orange-500 transition"><FaFacebookF /></a>
            <a href="https://www.instagram.com/programming_world360/" className="hover:text-orange-500 transition"><FaInstagram /></a>
            <a href="https://www.youtube.com/@programming_world360" className="hover:text-orange-500 transition"><FaYoutube /></a>
            <a href="https://www.linkedin.com/in/nadeem-mushtaq-870211345/" className="hover:text-orange-500 transition"><FaLinkedin/></a>
          </div>
        </div>
      </div>

      <div className="border-t border-[#1f1f1f] mt-10 pt-6 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} <span className="text-white font-semibold">Nadeem Foods</span>. All rights reserved.
      </div>
    </footer>
  );
}
