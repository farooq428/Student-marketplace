const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-800">Green Track</h4>
            <p className="text-sm text-gray-600 mt-2">A student-to-student marketplace for buying and selling used items.</p>
          </div>

          <div className="flex gap-6 justify-between">
            <div>
              <h5 className="text-sm font-semibold text-gray-700">Company</h5>
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                <li><a href="#" className="hover:text-green-600">About</a></li>
                <li><a href="#" className="hover:text-green-600">Careers</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-sm font-semibold text-gray-700">Legal</h5>
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                <li><a href="#" className="hover:text-green-600">Privacy</a></li>
                <li><a href="#" className="hover:text-green-600">Terms</a></li>
              </ul>
            </div>
          </div>

          <div>
            <h5 className="text-sm font-semibold text-gray-700">Contact</h5>
            <p className="text-sm text-gray-600 mt-2">support@greentrack.example</p>
            <div className="mt-3 flex gap-3">
              <a href="#" className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">F</a>
              <a href="#" className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">T</a>
              <a href="#" className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">I</a>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Green Track — Student Marketplace. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;