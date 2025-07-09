import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Network, ZoomIn, ZoomOut, RotateCcw, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ForceGraph3D from "react-force-graph-3d";
import SpriteText from "three-spritetext";
import { useStoreState, useStoreActions } from "@/store/hooks";
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";
import {
  CoinData,
  HashRateData,
  NetworkAnalysisData,
} from "@/store/models/transactions.model";
import * as THREE from "three";

const chartConfig = {
  style: {
    background: "white",
    border: "1px solid hsl(var(--border))",
    borderRadius: "var(--radius)",
  },
};

interface AreaChartData {
  timestamp: number;
  [symbol: string]: number;
}

export function NetworkAnalysis() {
  type Node = { id: string; group: number; color: string };
  type Link = { source: string; target: string; value: number };

  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [showCharts, setShowCharts] = useState(true);
  const graphRef = useRef<any>(null);
  const transactions = useStoreState(
    (state) => state.transactionsModel.transactions
  );
  const networkAnalysis = useStoreState<NetworkAnalysisData>(
    (state) => state.transactionsModel.networkAnalysis
  );
  const getNetworkAnalysis = useStoreActions(
    (actions) => actions.transactionsModel.getNetworkAnalysis
  );
  const fetchTransactions = useStoreActions(
    (actions) => actions.transactionsModel.fetchTransactions
  );
  const [coinData, setCoinData] = useState<CoinData[]>([]);
  const [hashRateData, setHashRateData] = useState<HashRateData>();
  const [isLoading, setIsLoading] = useState(true);

  const memoizedCoinData = useMemo(() => coinData, [JSON.stringify(coinData)]);
  const memoizedHashRateData = useMemo(
    () => hashRateData?.data,
    [JSON.stringify(hashRateData?.data)]
  );

  const formatTime = useCallback((unixTimestamp: number) => {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  const stringToColor = useCallback((str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ("00" + value.toString(16)).substr(-2);
    }
    return color;
  }, []);

  useEffect(() => {
    if (!transactions.length) {
      fetchTransactions();
    }
  }, [transactions.length, fetchTransactions]);

    useEffect(() => {
      if (!isPlaying) return;
  
      const newNodes = new Set<string>();
      const newLinks: Link[] = [];
  
      transactions.forEach((tx) => {
        newNodes.add(tx.from);
        newNodes.add(tx.to);
        newLinks.push({
          source: tx.from,
          target: tx.to,
          value: parseFloat(tx.amount),
        });
      });
  
      setNodes((prevNodes) => {
        const updatedNodes = [...prevNodes];
        newNodes.forEach((node) => {
          if (!prevNodes.find((n) => n.id === node)) {
            updatedNodes.push({
              id: node,
              group: 1,
              color: stringToColor(node),
            });
          }
        });
        return updatedNodes;
      });

      setLinks((prevLinks) => {
        const updatedLinks = [...prevLinks];
        newLinks.forEach((link) => {
          if (!prevLinks.find((l) => l.source === link.source && l.target === link.target)) {
            updatedLinks.push(link);
          }
        });
        return updatedLinks;
      });

      if (graphRef.current) {
        graphRef.current.zoomToFit(400);
      }
    }, [transactions, isPlaying]);

  const handleReset = () => {
    setNodes([]);
    setLinks([]);
  };

  const handleZoomIn = () => {
    if (graphRef.current) {
      graphRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (graphRef.current) {
      graphRef.current.zoomOut();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getNetworkAnalysis();
    }, 10000);
    return () => clearInterval(interval);
  }, [getNetworkAnalysis]);

  useEffect(() => {
    if (networkAnalysis.topCoinsData.length > 0) {
      setIsLoading(false);
    }
    if (!networkAnalysis?.topCoinsData || !networkAnalysis?.hashRateData) {
      getNetworkAnalysis();
    } else {
      setCoinData(networkAnalysis.topCoinsData);
      setHashRateData(networkAnalysis.hashRateData);
    }
  }, [networkAnalysis, getNetworkAnalysis]);

  const normalizeData = (data: number[]) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    return data.map((value) => ((value - min) / (max - min)) * 100);
  };

  const areaChartData = useMemo(() => {
    const result: AreaChartData[] = [];
    const generatedTimestamps: number[] = [];

    for (let i = 48; i < 72; i++) {
      const timestamp = new Date();
      timestamp.setHours(timestamp.getHours() - i);
      generatedTimestamps.push(timestamp.getTime());
    }

    generatedTimestamps.forEach((timestamp) => {
      const dataPoint: AreaChartData = { timestamp };
      coinData.forEach((coin) => {
        const nearestDataPoint = coin.data.reduce((prev, curr) => {
          return Math.abs(curr.timestamp - timestamp) <
            Math.abs(prev.timestamp - timestamp)
            ? curr
            : prev;
        });
        dataPoint[coin.symbol] = nearestDataPoint ? nearestDataPoint.value : 0;
      });
      result.push(dataPoint);
    });

    const normalizedResult = result.map((dataPoint) => {
      const formattedDataPoint: any = {
        timestamp: formatTime(dataPoint.timestamp),
      };
      coinData.forEach((coin) => {
        formattedDataPoint[coin.symbol] = dataPoint[coin.symbol];
      });
      return formattedDataPoint;
    });

    coinData.forEach((coin) => {
      const values = normalizedResult.map((dataPoint) => dataPoint[coin.symbol]);
      const normalizedValues = normalizeData(values);
      normalizedResult.forEach((dataPoint, index) => {
        dataPoint[coin.symbol] = normalizedValues[index];
      });
    });

    return normalizedResult;
  }, [coinData, formatTime]);

  const renderSkeletonChart = () => (
    <div className="animate-pulse space-y-4">
      <Skeleton className="h-[300px] w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <Skeleton className="h-12 w-3/4" />

        <Card className="mb-8">
          <CardHeader>
            <Skeleton className="h-6 w-2/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="h-[550px]">
            <Skeleton className="w-full h-full" />
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-24" />
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-6 w-12" />
            </div>
          </CardFooter>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>{renderSkeletonChart()}</CardContent>
        </Card>

        <div className="flex flex-wrap -mx-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-full md:w-1/2 px-4 mb-8">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>{renderSkeletonChart()}</CardContent>
              </Card>
            </div>
          ))}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>{renderSkeletonChart()}</CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <Network className="mr-2 h-8 w-8 text-primary" />
          Neural Transaction Network
        </h1>
        <Button onClick={() => setShowCharts(!showCharts)}>
          {showCharts ? "Show 3D Visualization" : "Show Charts"}
        </Button>
      </div>

      {showCharts ? (
        <>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Network Statistics</CardTitle>
              <CardDescription>
                Real-time metrics of the transaction network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">{nodes?.length || 0}</span>
                  <span className="text-sm text-muted-foreground">Total Nodes</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">{links?.length || 0}</span>
                  <span className="text-sm text-muted-foreground">
                    Total Transactions
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">
                    {links
                      ?.reduce((sum, link) => sum + (link.value || 0), 0)
                      .toFixed(2) || "0.00"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Total Transaction Value
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Network Activity</CardTitle>
              <CardDescription>Real-time coin value overview</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  width={500}
                  height={400}
                  data={areaChartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  {...chartConfig}
                >
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {coinData.map((coin) => (
                    <Area
                      key={coin.symbol}
                      type="monotone"
                      dataKey={coin.symbol}
                      stackId="1"
                      stroke={stringToColor(coin.symbol)}
                      fill={`${stringToColor(coin.symbol)}80`}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {memoizedCoinData && (
            <div className="flex flex-wrap -mx-4">
              {memoizedCoinData.map((coin) => (
                <div key={coin.symbol} className="w-full md:w-1/2 px-4 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>{coin.symbol}</CardTitle>
                      <CardDescription>
                        Real-time metrics of {coin.symbol} in the network
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={coin.data} {...chartConfig}>
                          <XAxis dataKey="timestamp" tickFormatter={formatTime} />
                          <YAxis domain={["auto", "auto"]} />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="value"
                            name={coin.symbol + " Price"}
                            stroke={stringToColor(coin.symbol)}
                            dot={false}
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}

          {memoizedHashRateData && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Hash Rate</CardTitle>
                <CardDescription>
                  Real-time hash rate of the network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={memoizedHashRateData} {...chartConfig}>
                    <XAxis dataKey="time" tickFormatter={formatTime} />
                    <YAxis domain={["auto", "auto"]} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="value"
                      name="Hash Rate"
                      fill={stringToColor("HashRate")}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Real-Time Blockchain Visualization</CardTitle>
            <CardDescription>
              Watch as cryptocurrency transactions form a living, evolving neural
              network
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col h-[550px]">
            <div className="flex-grow overflow-hidden relative flex items-center justify-center">
            <ForceGraph3D
              graphData={{ nodes, links }}
              nodeAutoColorBy="group"
              nodeThreeObject={(node) => {
                const geometry = new THREE.SphereGeometry(5, 32, 32);
                const material = new THREE.MeshBasicMaterial({ color: node.color });
                const sphere = new THREE.Mesh(geometry, material);

                const text = new SpriteText(node.id.substr(0, 6));
                text.color = 'black';
                text.textHeight = 3;
                text.position.y = 8;

                const group = new THREE.Group();
                group.add(sphere);
                group.add(text);

                return group;
              }}
              linkDirectionalParticles={2}
              linkDirectionalParticleSpeed={(d) => d.value * 0.001}
              linkWidth={1}
            />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? (
                  <Pause className="mr-2 h-4 w-4" />
                ) : (
                  <Play className="mr-2 h-4 w-4" />
                )}
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <Button onClick={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button onClick={handleZoomIn}>
                <ZoomIn className="mr-2 h-4 w-4" />
                Zoom In
              </Button>
              <Button onClick={handleZoomOut}>
                <ZoomOut className="mr-2 h-4 w-4" />
                Zoom Out
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Speed:</span>
              <Slider
                min={0.5}
                max={5}
                step={0.5}
                value={[speed]}
                onValueChange={([value]) => setSpeed(value)}
                className="w-32"
              />
              <Badge variant="secondary">{speed}x</Badge>
            </div>
          </CardFooter>
        </Card>
      )}
    </motion.div>
  );
}

export default NetworkAnalysis;
