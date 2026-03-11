import { useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";

interface ErrorPageProps {
  code?: number;
}

const ErrorPage = ({ code = 404 }: ErrorPageProps) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const queryCode = Number(searchParams.get("code"));
  const statusCode =
    Number.isInteger(queryCode) && queryCode >= 400 && queryCode <= 599
      ? queryCode
      : code;

  const errorTitle =
    statusCode === 404
      ? "Page not found"
      : statusCode === 500
        ? "Internal server error"
        : "Something went wrong";

  useEffect(() => {
    console.error(
      `${statusCode} Error: User attempted to access route:`,
      location.pathname,
    );
  }, [location.pathname, statusCode]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <div className="xp-window w-[min(95vw,620px)] overflow-hidden">
        <div className="xp-title-bar-inactive">
          <span>System Error</span>
          <div className="xp-close-btn">×</div>
        </div>

        <div className="xp-window-body text-center py-8 px-6">
          <p className="text-xs text-muted-foreground mb-2">Error Code</p>
          <h1 className="pixel-text text-4xl md:text-5xl font-bold text-destructive mb-4">
            {statusCode}
          </h1>
          <p className="pixel-text text-xl md:text-2xl text-card-foreground mb-3">
            DEFINITELY FIRED.
          </p>
          <p className="text-base text-muted-foreground mb-2">{errorTitle}</p>
          <p className="text-sm text-muted-foreground mb-6">
            {location.pathname}
          </p>

          <Link to="/" className="xp-button-primary inline-block px-8 py-2">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
