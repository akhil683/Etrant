import { Component, type ReactNode } from "react";

import { ErrorState } from "@/components/ui";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  message: string;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    message: "",
  };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message:
        error instanceof Error ? error.message : "An unknown error occurred.",
    };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error("App error boundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorState
          title="Something broke"
          description={this.state.message}
          onRetry={() => this.setState({ hasError: false, message: "" })}
        />
      );
    }

    return this.props.children;
  }
}
