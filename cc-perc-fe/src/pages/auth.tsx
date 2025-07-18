import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


import { Alert, Checkbox } from "@heroui/react";
import DefaultLayout from "@/layouts/default";
import { useAuth } from "@/contexts/AuthContext";
import { FastForwardIcon, ShieldIcon, EyeIcon, BeakerIcon } from "@/components/icons";

const AnimatedOrb = ({
  delay = 0,
  className = "",
}: {
  delay?: number;
  className?: string;
}) => (
  <motion.div
    animate={{
      opacity: [0.3, 0.8, 0.3],
      scale: [1, 1.2, 1],
      x: [0, 20, -20, 0],
      y: [0, -30, 30, 0],
    }}
    className={`absolute rounded-full bg-gradient-to-r from-orange-400 to-orange-600 blur-xl ${className}`}
    initial={{ opacity: 0, scale: 0 }}
    transition={{
      duration: 6,
      delay,
      repeat: Infinity,
      repeatType: "loop",
    }}
  />
);

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState("");

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        await register(
          formData.email,
          formData.password,
          formData.firstName,
          formData.lastName,
        );
      }
      navigate("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <DefaultLayout>
      <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Animated Background Orbs */}
        <AnimatedOrb className="top-20 left-10 w-32 h-32" delay={0} />
        <AnimatedOrb className="top-40 right-20 w-24 h-24" delay={2} />
        <AnimatedOrb className="bottom-32 left-1/4 w-40 h-40" delay={4} />
        <AnimatedOrb className="bottom-20 right-10 w-28 h-28" delay={1} />

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Info */}
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block"
              initial={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-center lg:text-left">
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    Welcome to{" "}
                    <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 bg-clip-text text-transparent">
                        Ai<span className="font-bold text-2xl">∀</span>i
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                    Discover how AI agents evaluate your content and optimize
                    your digital presence for the future of search.
                  </p>
                </motion.div>

                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                      <FastForwardIcon className="text-orange-500" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        AI-Powered Analysis
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Advanced algorithms evaluate your content
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                      <ShieldIcon className="text-orange-500" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        Secure & Private
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Your data is protected and encrypted
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                      <EyeIcon className="text-orange-500" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        Real-time Insights
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Get instant feedback and recommendations
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Side - Auth Form */}
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-orange-200 dark:border-orange-700 shadow-2xl min-w-[500px] p-4">
                <CardHeader className="flex flex-col items-center pb-6 w-full justify-start items-start mb-2">
                  <motion.div
                    // animate={{ scale: 1, opacity: 1 }}
                    // initial={{ scale: 0.8, opacity: 0 }}
                    // transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <div className="flex flex-row items-center justify-center gap-2">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                        <FastForwardIcon className="text-white" size={45} />
                      </div>
                      <div className="flex flex-col items-start justify-center">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                          {isLogin ? "Welcome Back" : "Create Account"}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                          {isLogin
                            ? "Sign in to access your AI analysis dashboard"
                              : "Join us to optimize your content with AI"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </CardHeader>

                <CardBody className="pt-4">
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <AnimatePresence mode="wait">
                      {!isLogin && (
                        <motion.div
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          initial={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* First Name */}
                          <Input
                            className="mb-4"
                            classNames={{
                              inputWrapper:
                                "bg-white dark:bg-gray-700 border-2 border-orange-200 dark:border-orange-700 hover:border-orange-300 focus-within:border-orange-500",
                            }}
                            label="First Name"
                            placeholder="Enter your first name"
                            required={!isLogin}
                            type="text"
                            value={formData.firstName}
                            onChange={(e) =>
                              handleInputChange("firstName", e.target.value)
                            }
                          />

                          {/* Last Name */}
                          <Input
                            className="mb-4"
                            classNames={{
                              inputWrapper:
                                "bg-white dark:bg-gray-700 border-2 border-orange-200 dark:border-orange-700 hover:border-orange-300 focus-within:border-orange-500",
                            }}
                            label="Last Name"
                            placeholder="Enter your last name"
                            required={!isLogin}
                            type="text"
                            value={formData.lastName}
                            onChange={(e) =>
                              handleInputChange("lastName", e.target.value)
                            }
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Input
                      required
                      classNames={{
                        inputWrapper:
                          "bg-white dark:bg-gray-700 border-2 border-orange-200 dark:border-orange-700 hover:border-orange-300 focus-within:border-orange-500",
                      }}
                      label="Email Address"
                      placeholder="Enter your email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />

                    <Input
                      required
                      classNames={{
                        inputWrapper:
                          "bg-white dark:bg-gray-700 border-2 border-orange-200 dark:border-orange-700 hover:border-orange-300 focus-within:border-orange-500",
                      }}
                      endContent={
                        <button
                          className="text-gray-400 hover:text-orange-500 transition-colors"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "🙊" : "🙈"}
                        </button>
                      }
                      label="Password"
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                    />

                    <AnimatePresence mode="wait">
                      {!isLogin && (
                        <motion.div
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          initial={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Input
                            classNames={{
                              inputWrapper:
                                "bg-white dark:bg-gray-700 border-2 border-orange-200 dark:border-orange-700 hover:border-orange-300 focus-within:border-orange-500",
                            }}
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            required={!isLogin}
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={(e) =>
                              handleInputChange(
                                "confirmPassword",
                                e.target.value,
                              )
                            }
                            endContent={
                              <button
                                className="text-gray-400 hover:text-orange-500 transition-colors"
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? "😉" : "🤔"}
                              </button>
                            }
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {error && (
                      <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg"
                        initial={{ opacity: 0, y: -10 }}
                      >
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {error}
                        </p>
                      </motion.div>
                    )}

                    {isLogin && (
                      <div className="flex justify-between items-center mx-2">
                        <div className="flex items-center gap-2 ">
                          <Checkbox
                            id="remember"
                            size="sm"
                          >
                              Remember me
                          </Checkbox>
                        </div>
                        <Link
                          className="text-sm text-orange-500 hover:text-orange-600 transition-colors"
                          href="#"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    )}

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg"
                        color="primary"
                        disabled={isLoading}
                        isLoading={isLoading}
                        size="lg"
                        type="submit"
                      >
                        {isLoading ? (
                          <span className="flex items-center">
                            <motion.div
                              animate={{ rotate: 360 }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            />
                            {isLogin ? "Signing In..." : "Creating Account..."}
                          </span>
                        ) : isLogin ? (
                          "Sign In"
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </motion.div>

                    <div className="text-center border-gray-200 dark:border-gray-700">
                      <p className="text-gray-600 dark:text-gray-300">
                        {isLogin
                          ? "Don't have an account?"
                          : "Already have an account?"}
                        <button
                          className="ml-2 text-orange-500 hover:text-orange-600 font-medium transition-colors"
                          type="button"
                          onClick={() => setIsLogin(!isLogin)}
                        >
                          {isLogin ? "Create Account" : "Sign In"}
                        </button>
                      </p>
                    </div>
                  </form>

                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    {isLogin && (
                      <Alert color="default" title="Demo Credentials" description={
                        <p className="text-xs">
                          <strong>Email:</strong> demo@example.com<br/>
                          <strong>Password:</strong> password123
                        </p>
                      }
                      classNames={{
                        title: "text-xs",
                        description: "text-xs",
                        base: "p-2 mb-4",
                      }}
                      icon={<BeakerIcon className="text-orange-500" size={20} />}
                      />
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      By {isLogin ? "signing in" : "creating an account"}, you
                      agree to our{" "}
                      <Link
                        className="text-orange-500 hover:text-orange-600"
                        href="#"
                        size="sm"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        className="text-orange-500 hover:text-orange-600"
                        href="#"
                        size="sm"
                      >
                        Privacy Policy
                      </Link>
                    </p>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
