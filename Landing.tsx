import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Search,
  Network,
  Lock,
  BarChart3,
  FileText,
  LogIn,
  Database,
  Zap,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModeToggle } from "@/components/Header";
import { useNavigate } from "react-router-dom";
import heroLight from "@/assets/hero-light.svg";
import heroDark from "@/assets/hero-dark.svg";
import { useTheme } from "@/contexts/useTheme";
import { useState } from "react";

export function LandingPage() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const login = () => {
    navigate("/auth");
  };

  const requestAccess = () => {
    navigate("/request-access");
  };

  const learnMore = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <header className="relative z-10 bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-primary" />
              <span className="ml-2 text-2xl font-bold text-gray-800 dark:text-white">
                CryptoTrace
              </span>
            </div>
            <div className="block lg:hidden">
              <button
                className="text-gray-800 dark:text-white focus:outline-none"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  ></path>
                </svg>
              </button>
            </div>
            <nav
              className={`lg:flex lg:items-center ${menuOpen ? "block" : "hidden"} absolute lg:static top-16 left-0 w-full lg:w-auto bg-white dark:bg-gray-800 lg:bg-transparent shadow-lg lg:shadow-none`}
            >
              <ul className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 items-center p-4 lg:p-0">
                <li>
                  <a
                    href="#features"
                    className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-400"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#methodology"
                    className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-400"
                  >
                    Methodology
                  </a>
                </li>
                <li>
                  <a
                    href="#innovation"
                    className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-400"
                  >
                    Innovation
                  </a>
                </li>
                <li>
                  <Button variant="outline" size="sm" onClick={login}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </li>
                <li>
                  <ModeToggle />
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <section className="relative z-1 pt-20 pb-20 md:pt-32 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
              >
                Advanced Crypto Analytics for Drug Law Enforcement
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl text-gray-600 dark:text-gray-300 mb-8"
              >
                CryptoTrace empowers DLEAs with cutting-edge AI-powered
                blockchain analytics to combat cryptocurrency misuse in drug
                trafficking and organized crime.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button size="lg" className="mr-4" onClick={requestAccess}>
                  Request Access
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={learnMore}>
                  Learn More
                </Button>
              </motion.div>
            </div>
            <div className="md:w-1/2">
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                src={isDarkMode ? heroDark : heroLight}
                alt="CryptoTrace Dashboard for DLEAs"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="relative z-10 bg-white dark:bg-gray-800 py-20"
      >
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
            Key Features for DLEA Investigations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Search className="h-12 w-12 text-primary" />}
              title="Advanced Crypto Search"
              description="Quickly trace and analyze blockchain transactions related to drug trafficking operations across multiple cryptocurrencies."
            />
            <FeatureCard
              icon={<Network className="h-12 w-12 text-primary" />}
              title="Criminal Network Analysis"
              description="Visualize complex transaction networks to identify key players and money laundering patterns using graph theory."
            />
            <FeatureCard
              icon={<Lock className="h-12 w-12 text-primary" />}
              title="Secure Case Management"
              description="Encrypted storage and sharing of sensitive case information and evidence, compliant with DLEA security standards."
            />
            <FeatureCard
              icon={<BarChart3 className="h-12 w-12 text-primary" />}
              title="Real-time Analytics"
              description="Monitor cryptocurrency movements and receive instant alerts on suspicious activities using machine learning algorithms."
            />
            <FeatureCard
              icon={<FileText className="h-12 w-12 text-primary" />}
              title="Compliance Reporting"
              description="Generate detailed reports for legal proceedings and interagency collaboration, strengthening cases against drug traffickers."
            />
            <FeatureCard
              icon={<Eye className="h-12 w-12 text-primary" />}
              title="Privacy Coin Tracking"
              description="Specialized techniques to trace transactions in privacy-focused coins like Monero, overcoming obfuscation efforts."
            />
          </div>
        </div>
      </section>

      <section
        id="methodology"
        className="relative z-10 bg-gray-50 dark:bg-gray-900 py-20"
      >
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
            CryptoTrace Methodology
          </h2>
          <Tabs defaultValue="data-collection" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto gap-2">
              <TabsTrigger value="data-collection">Data Collection</TabsTrigger>
              <TabsTrigger value="ml-analysis">ML Analysis</TabsTrigger>
              <TabsTrigger value="graph-theory">Graph Theory</TabsTrigger>
              <TabsTrigger value="real-time-monitoring">
                Real-time Monitoring
              </TabsTrigger>
              <TabsTrigger value="cross-referencing">
                Cross-Referencing
              </TabsTrigger>
              <TabsTrigger value="user-interface">User Interface</TabsTrigger>
            </TabsList>
            <TabsContent value="data-collection">
              <Card>
                <CardHeader>
                  <CardTitle>Blockchain Data Collection</CardTitle>
                  <CardDescription>
                    Gathering raw transaction data from multiple blockchains
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    CryptoTrace collects transaction data from public
                    blockchains like Bitcoin, Ethereum, and privacy-focused
                    coins. Our specialized techniques mitigate obfuscation
                    efforts of mixers and tumblers.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="ml-analysis">
              <Card>
                <CardHeader>
                  <CardTitle>Machine Learning Analysis</CardTitle>
                  <CardDescription>
                    Detecting patterns and anomalies in transaction data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Our advanced machine learning algorithms, trained on vast
                    datasets, identify suspicious transaction patterns and flag
                    activities potentially related to drug trafficking.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="graph-theory">
              <Card>
                <CardHeader>
                  <CardTitle>Graph Theory Visualization</CardTitle>
                  <CardDescription>
                    Mapping relationships between cryptocurrency addresses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Using graph-based approaches, CryptoTrace visualizes
                    transaction networks, allowing investigators to track fund
                    movements and identify clusters of illegal activities.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="real-time-monitoring">
              <Card>
                <CardHeader>
                  <CardTitle>Real-Time Blockchain Monitoring</CardTitle>
                  <CardDescription>
                    Continuous surveillance of blockchain activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Our system provides automatic alerts when it detects
                    suspicious behavior, such as large transfers or structured
                    transactions designed to evade detection.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="cross-referencing">
              <Card>
                <CardHeader>
                  <CardTitle>Cross-Referencing Databases</CardTitle>
                  <CardDescription>
                    Integrating external data sources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    CryptoTrace cross-references blockchain data with external
                    databases, including blacklists and law enforcement records,
                    to identify known criminals or suspicious actors.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="user-interface">
              <Card>
                <CardHeader>
                  <CardTitle>Intuitive User Interface</CardTitle>
                  <CardDescription>
                    Simplifying complex blockchain analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Our user-friendly interface allows DLEA personnel to conduct
                    sophisticated cryptocurrency investigations without needing
                    specialized blockchain knowledge.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section
        id="innovation"
        className="relative z-10 bg-white dark:bg-gray-800 py-20"
      >
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
            CryptoTrace Innovations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <InnovationCard
              icon={<Zap className="h-8 w-8 text-primary" />}
              title="Automated Blockchain Surveillance"
              description="CryptoTrace automates the process of identifying suspicious transactions, enabling faster response times and more accurate results for law enforcement agencies."
            />
            <InnovationCard
              icon={<Network className="h-8 w-8 text-primary" />}
              title="Cross-Blockchain Integration"
              description="Our platform traces funds across multiple blockchain networks, including privacy-focused coins, providing a comprehensive view of illicit fund movements."
            />
            <InnovationCard
              icon={<Database className="h-8 w-8 text-primary" />}
              title="Machine Learning for Anomaly Detection"
              description="Leveraging machine learning to identify transaction patterns indicative of money laundering or drug trafficking, providing a proactive approach to monitoring blockchain activity."
            />
            <InnovationCard
              icon={<Eye className="h-8 w-8 text-primary" />}
              title="Visualization of Complex Networks"
              description="Graph-based visualization simplifies the investigation process, allowing even non-technical users to trace fund movements and identify key players within illegal networks."
            />
            <InnovationCard
              icon={<BarChart3 className="h-8 w-8 text-primary" />}
              title="Real-Time Alerts and Monitoring"
              description="CryptoTrace provides an edge over current solutions by notifying investigators as soon as suspicious activity occurs, allowing for immediate action."
            />
            <InnovationCard
              icon={<Shield className="h-8 w-8 text-primary" />}
              title="DLEA-Focused Design"
              description="Our platform is tailored specifically for Drug Law Enforcement Agencies, addressing their unique challenges in combating cryptocurrency-enabled drug trafficking."
            />
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-primary text-white py-20 dark:bg-gray-800 dark:text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">
            Ready to enhance your DLEA investigations with CryptoTrace?
          </h2>
          <Button size="lg" variant="secondary" onClick={requestAccess}>
            Request a Demo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      <footer className="relative z-10 bg-gray-100 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">
                CryptoTrace
              </span>
            </div>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400"
              >
                Contact Us
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
            © 2024 CryptoTrace. All rights reserved. For authorized DLEA use
            only.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {icon}
          <span className="ml-4">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

function InnovationCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {icon}
          <span className="ml-2 text-lg">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
