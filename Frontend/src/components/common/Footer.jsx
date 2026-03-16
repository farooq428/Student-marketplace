const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Green Track</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">A student-to-student marketplace for buying and selling used items.</p>
            <div className="mt-4">
              <span className="text-xs text-gray-500 dark:text-gray-400">Built with ❤️ for students</span>
            </div>
          </div>

          <div className="flex gap-6 justify-between">
            <div>
              <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Company</h5>
              <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li><a href="/about" className="hover:text-green-600">About</a></li>
                <li><a href="/careers" className="hover:text-green-600">Careers</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Legal</h5>
              <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li><a href="/privacy" className="hover:text-green-600">Privacy</a></li>
                <li><a href="/terms" className="hover:text-green-600">Terms</a></li>
              </ul>
            </div>
          </div>

          <div>
            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Contact</h5>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">support@greentrack.example</p>
            <div className="mt-3 flex gap-3">
              <a href="#" aria-label="Facebook" className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center hover:bg-green-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.2v-2.9h2.2V9.3c0-2.2 1.3-3.4 3.3-3.4.95 0 1.95.17 1.95.17v2.2h-1.12c-1.1 0-1.44.68-1.44 1.38v1.66h2.45l-.39 2.9h-2.06v7A10 10 0 0022 12z" /></svg>
              </a>
              <a href="#" aria-label="Twitter" className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center hover:bg-green-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 24 24" fill="currentColor"><path d="M22 5.92c-.63.28-1.3.46-2 .55a3.48 3.48 0 001.52-1.93 6.9 6.9 0 01-2.2.84A3.45 3.45 0 0012.1 8.1c0 .27.03.53.09.78A9.8 9.8 0 013 4.7a3.45 3.45 0 001.07 4.6c-.5 0-.98-.15-1.4-.38v.04c0 1.64 1.17 3 2.7 3.3a3.46 3.46 0 01-1.39.05c.39 1.2 1.53 2.08 2.88 2.11A6.92 6.92 0 012 19.54a9.76 9.76 0 005.29 1.55c6.35 0 9.84-5.27 9.84-9.84v-.45A7.05 7.05 0 0022 5.92z" /></svg>
              </a>
              <a href="#" aria-label="Instagram" className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center hover:bg-green-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5.5A4.5 4.5 0 107 12a4.5 4.5 0 005-4.5zM20.5 6a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Green Track — Student Marketplace. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;