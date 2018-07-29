import GeometryCalculator from "models/GeometryCalculator";
import * as polygons from "models/polygons/Index";

/**
 * 多面体データ基礎構造構築機能
 *
 * @param   object  params
 */
export default class PolyhedronBasisTheta {
    /**
     * 共通プロパティ
     *
     */
    property = {
        // 依存モデル
        basis: null,

        // HTMLデータ
        canvas_context: null,

        // 外部設定値
        alpha: 20,
        size: 100,
        fill_style: null,
        stroke_style: null,

        // 内部設定値
        _center: null,

        // メソッド共有変数
        reles: null,
        moment_poses: null,
        surfaces: null,
        moment_surfaces: null,
    };

    /**
     * 依存ライブラリ
     */
    geometry_calculator: GeometryCalculator = null;

    constructor(params) {
        // 依存ライブラリ初期化
        this.geometry_calculator = GeometryCalculator;

        // プロパティ定義
        for (var i in params) {
            if (this[i] !== undefined) {
                this[i] = params[i];
            }
        }
    }

    /**
     * 実体化
     *
     * @param   string  embody_key
     * @param   string  canvas_context
     * @param   object  params
     */
    summons(embody_key, canvas_context, params?: {}): Object | void {
        try {
            // 実体化
            const Embody = polygons[embody_key];
            const embody = new Embody();
            embody.basis = this;

            // プロパティ定義
            for (var i in this.property) {
                if (embody[i] === undefined) {
                    embody[i] = this.property[i];
                }
            }

            if (params != undefined) {
                for (var i in params) {
                    if (embody[i] !== undefined) {
                        embody[i] = params[i];
                    }
                }
            }

            // 内部変数の初期化
            embody._center = embody.size / 2 + 0.5;
            embody.reles = {};
            embody.moment_poses = {};

            // HTMLデータの初期化
            embody.canvas_context = canvas_context;

            // 共通メソッド定義
            var ref = this;
            if (embody.configure === undefined) {
                throw 'Undefined method(configure()).';
            }
            embody.setDirection = function (rotate_theta, vector_theta, length_theta) {
                ref.setDirection(this, rotate_theta, vector_theta, length_theta);
            };
            embody.output = function () {
                ref.output(this);
            };

            // 実体初期化
            embody.configure();

            return embody;
        } catch (e) {
            throw e;
        }
    }

    /**
     * 方向転換
     *
     * @param   object  embody
     * @param   float   rotate_theta
     * @param   float   vector_theta
     * @param   float   length_theta
     */
    setDirection(embody, rotate_theta, vector_theta, length_theta): void {
        embody.moment_surfaces = new Array();

        var axis_theta = (vector_theta - (Math.PI / 2));

        for (var i in embody.surfaces) {
            var poses = new Array();
            var z_index = 0;

            for (var j = 0; j < embody.surfaces[i].length; j++) {
                var pos_code = embody.surfaces[i][j];

                var LS0 = GeometryCalculator.getLengthesByTheta('Z', embody.reles[pos_code].X);
                var RY0 = LS0.Y;
                var LZ0 = LS0.X;

                var TY1 = embody.reles[pos_code].Y + rotate_theta - axis_theta;
                var LS1 = GeometryCalculator.getLengthesByTheta('Y', TY1);
                var LX1 = LS1.X * RY0 * -1;
                var LY1 = LS1.Y * RY0 * -1;
                var TX1 = GeometryCalculator.getThetaByLengthes('X', LX1, LZ0);
                var RX1 = GeometryCalculator.getLengthByPytha(null, LX1, LZ0);
                var TX2 = TX1 + length_theta;
                var LS2 = GeometryCalculator.getLengthesByTheta('X', TX2);
                var LX2 = LS2.X * RX1;
                var LZ2 = LS2.Y * RX1;
                var RY2 = GeometryCalculator.getLengthByPytha(null, LX2, LY1);
                var TY2 = GeometryCalculator.getThetaByLengthes('Y', LX2, LY1);

                var TY3 = TY2 + axis_theta;
                var LS3 = GeometryCalculator.getLengthesByTheta('Y', TY3);
                var LX3 = LS3.X * RY2;
                var LY3 = LS3.Y * RY2;
                var X = LX3 * embody.reles[pos_code].R;
                var Y = LY3 * embody.reles[pos_code].R;
                var Z = LZ2 * embody.reles[pos_code].R;

                embody.moment_poses[pos_code] = { X: X, Y: Y, Z: Z };

                z_index += Z;
            }

            z_index = z_index / embody.surfaces[i].length;
            embody.moment_surfaces.push({ code: i, z_index: z_index });
        }

        embody.moment_surfaces.sort(function (A, B) { return A.z_index - B.z_index; });
    }

    /**
     * 描画
     *
     * @param   object  embody
     */
    output(embody): void {
        embody.canvas_context.setTransform(1, 0, 0, 1, 0, 0);
        embody.canvas_context.clearRect(0, 0, embody.size, embody.size);

        for (var i = 0; i < embody.moment_surfaces.length; i++) {
            embody.canvas_context.beginPath();

            var surface = embody.surfaces[embody.moment_surfaces[i].code];

            for (var j = 0; j < surface.length; j++) {
                var pos = embody.moment_poses[surface[j]];
                if (j == 0) {
                    embody.canvas_context.moveTo(embody._center + pos.X, embody._center + pos.Y);
                } else {
                    embody.canvas_context.lineTo(embody._center + pos.X, embody._center + pos.Y);
                }
            }

            embody.canvas_context.closePath();
            embody.canvas_context.fillStyle = embody.fill_style;
            embody.canvas_context.fill();
            embody.canvas_context.strokeStyle = embody.stroke_style;
            embody.canvas_context.stroke();
        }
    }
}
