const emparejar = require("../domain/resultado");

describe("Emparejar", () => {
  it("W", () => {
    const resultado = emparejar.sumarPuntos(0, "W");
    expect(resultado).toBe(3);
  });

  it("L", () => {
    const resultado = emparejar.sumarPuntos(0, "L");
    expect(resultado).toBe(0);
  });

  it("D", () => {
    const resultado = emparejar.sumarPuntos(0, "D");
    expect(resultado).toBe(1);
  });
});
