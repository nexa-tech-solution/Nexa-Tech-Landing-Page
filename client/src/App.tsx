import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import Product from "@/pages/Product";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/work/:slug" component={Product} />
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return <Router />;
}

export default App;
