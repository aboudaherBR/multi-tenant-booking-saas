import "../../src/global.css";

export default function ProfessionalReportsPage() {

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-bg)"
      }}
    >

      <div className="header-gradient">

        <h2 style={{ color: "white" }}>
          Relatórios
        </h2>

      </div>

      <div
        className="container-main"
        style={{
          marginTop: "-40px"
        }}
      >

        <div
          className="card"
          style={{
            padding: "20px"
          }}
        >

          <h1 className="heading">
            Relatórios do profissional
          </h1>

        </div>

      </div>

    </div>
  );
}