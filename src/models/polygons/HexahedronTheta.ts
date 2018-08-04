/**
 * 正六面体
 *
 */
class HexahedronTheta {
    /**
     * 初期化
     *
     */
    configure() {
        var finalizeRatioByPytha = this.basis.geometry_calculator.finalizeRatioByPytha;

        /*
        // 直角二等辺三角形比率
        var RA_A00 = {
            A: 1,
            B: Math.pow(2, 1 / 2)
        };

        var LX_A00 = this.alpha;
        var LX_A01 = LX_A00 * (RA_A00.B / RA_A00.A);
        var LX_A02 = LX_A01 / 2;
        var LX_A03 = this.basis.geometry_calculator.getLengthByPytha(null, LX_A00, LX_A02);

        var LT_A00 = LX_A03;

        var TX_A00 = Math.asin(LX_A00 / LX_A03);
        */
        var LX_A00 = 1;
        var LX_A01 = LX_A00 * Math.sin(Math.PI / 4);
        var RX_A00 = finalizeRatioByPytha({
            A: null,
            B: LX_A00,
            C: LX_A01
        });
        var LX_A02 = this.alpha * (RX_A00.B / RX_A00.A);

        var LT_A00 = this.alpha;
        var TX_A00 = Math.asin(LX_A02 / this.alpha);
        var TY_A00 = 0;

        var reles_base = {
            A0: {R: LT_A00, X: TX_A00, Y: TY_A00}
        };

        for (var i in reles_base) {
            var base_R = reles_base[i].R;
            var base_X = reles_base[i].X;
            var base_Y = reles_base[i].Y;

            for (var n = 0; n < 4; n ++) {
                this.reles[i + n + 'AO'] = {R: base_R};
                this.reles[i + n + 'SR'] = {R: base_R};

                this.reles[i + n + 'AO'].X = base_X;
                this.reles[i + n + 'AO'].Y = base_Y + ((Math.PI / 2) * n);
                this.reles[i + n + 'SR'].X = base_X + Math.PI;
                this.reles[i + n + 'SR'].Y = (base_Y + ((Math.PI / 2) * n)) * -1;
            }
        }

        this.surfaces = {
            A0_A: ['A00AO', 'A01AO', 'A02AO', 'A03AO'],
            A0_R: ['A00SR', 'A01SR', 'A02SR', 'A03SR'],
            B0_A: ['A00AO', 'A01AO', 'A01SR', 'A02SR'],
            B1_A: ['A02AO', 'A03AO', 'A03SR', 'A00SR'],
            B0_B: ['A00SR', 'A01SR', 'A01AO', 'A02AO'],
            B1_B: ['A02SR', 'A03SR', 'A03AO', 'A00AO']
        };
    }
};

export default HexahedronTheta;
