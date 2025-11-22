import { useAuth } from "../../hooks/useAuth.ts";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const { email, password, setPassword, setEmail, login, isLoading } =
    useAuth();

  const handleSubmit = async () => {
    await login();
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col justify-center px-8 py-8 lg:w-1/2 lg:px-20 xl:px-24">
        {/* Demo Notice */}
        <div className="mb-6 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border border-blue-200 shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-semibold text-blue-800">
                Demo Version
              </h3>
              <div className="mt-1 text-sm text-blue-700">
                <p>
                  This is a demo clone. The actual project is deployed at{" "}
                  <a 
                    href="https://ems.sdcmuj.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-semibold underline hover:text-blue-800"
                  >
                    ems.sdcmuj.com
                  </a>
                </p>
                <p className="mt-1">
                  <span className="font-medium">Demo Credentials:</span>{" "}
                  <span className="font-mono bg-blue-100 px-1 rounded">admin@1234</span> /{" "}
                  <span className="font-mono bg-blue-100 px-1 rounded">1234</span>
                </p>
                <p className="mt-1 text-xs">
                  Frontend deployed on Vercel • Backend deployed on Render
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md lg:w-96">
          <div className="text-center">
            <div className="flex items-center justify-center">
              <img
                alt="Your Company"
                src="/MUJ_logo.jpg"
                className="h-48 w-auto"
              />
            </div>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-8">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  onClick={handleSubmit}
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-muj-orange px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden w-1/2 lg:flex items-center justify-center bg-gray-100">
        <img
          alt="Dome Building"
          src="/institute-muj.jpg"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}