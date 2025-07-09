import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ModeToggle } from "@/components/Header";
import { AccessRequest } from "@/store/models/auth.model";
import { useStoreActions } from "@/store/hooks";

export function RequestAccess() {
  const requestAccess = useStoreActions((actions) => actions.authModel.requestAccess);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const goHome = () => {
    navigate("/");
  };

  const [formData, setFormData] = useState<AccessRequest>({
    name: "",
    email: "",
    agency: "",
    role: "",
    reason: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (step < 3) setStep((prev) => prev + 1);
  };

  const handlePrevious = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await requestAccess(formData);
    setLoading(false);
    setSuccess(true);
    toast({
      title: "Access Request Submitted",
      description: "We'll review your request and get back to you soon.",
    });
    // Redirect after 5 seconds
    setTimeout(() => {
      navigate("/landing");
    }, 5000);
  };

  const steps = [
    {
      title: "Personal Information",
      fields: (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Work Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary focus:border-primary"
              required
            />
          </div>
        </>
      ),
    },
    {
      title: "Agency Information",
      fields: (
        <>
          <div className="space-y-2">
            <Label htmlFor="agency">Law Enforcement Agency</Label>
            <Input
              id="agency"
              name="agency"
              value={formData.agency}
              onChange={handleInputChange}
              className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Your Role</Label>
            <RadioGroup
              name="role"
              value={formData.role}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, role: value }))
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="investigator" id="investigator" />
                <Label htmlFor="investigator">Investigator</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="analyst" id="analyst" />
                <Label htmlFor="analyst">Analyst</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="supervisor" id="supervisor" />
                <Label htmlFor="supervisor">Supervisor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
          </div>
        </>
      ),
    },
    {
      title: "Request Details",
      fields: (
        <div className="space-y-2">
          <Label htmlFor="reason">Reason for Access</Label>
          <Textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            required
            rows={4}
            placeholder="Please provide a brief explanation of why you need access to CryptoTrace..."
            className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary focus:border-primary"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-center mb-8">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold ml-2 text-gray-900 dark:text-white">
                Request Access to CryptoTrace
              </h1>
            </div>
            <AnimatePresence mode="wait">
              {!success ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                        {steps[step - 1].title}
                      </h2>
                      <div className="h-2 w-full bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-primary rounded-full transition-all duration-300 ease-in-out"
                          style={{ width: `${(step / steps.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        {steps[step - 1].fields}
                      </motion.div>
                    </AnimatePresence>
                    <div className="flex justify-between mt-8">
                      {step > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handlePrevious}
                        >
                          Previous
                        </Button>
                      )}
                      {step < steps.length ? (
                        <Button
                          type="button"
                          onClick={handleNext}
                          className="ml-auto"
                        >
                          Next
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className="ml-auto"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              Submit Request
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
                    Request Submitted Successfully
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    We&apos;ll review your request and get back to you soon.
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Redirecting to login page in 5 seconds...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div
        className="absolute bottom-4 left-4 text-gray-600 dark:text-gray-400 text-sm cursor-pointer"
        onClick={goHome}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          CryptoTrace
        </motion.div>
      </div>
      <div className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 text-sm flex items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex items-center"
        >
          <div className="mr-4">Secure • Encrypted • Blockchain-powered</div>
          <ModeToggle />
        </motion.div>
      </div>
    </div>
  );
}
