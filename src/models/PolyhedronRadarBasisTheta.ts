/**
 * 多面体データレーダーグラム基礎構造構築機能
 *
 * @param   Polyhedron_Basis_Theta operator_basis
 */
export default class PolyhedronRadarBasisTheta {
    polygon_basis = null
    operator_basis = null

    /**
     * 共通プロパティ
     *
     */
    property = {
        // 依存モデル
        "basis": null,

        "basis_fill_style": "rgba(255, 255, 255, 0.0)",
        "basis_stroke_style": "rgba(192, 192, 192, 0.5)",
        "shaft_fill_style": "rgba(255, 255, 255, 0.0)",
        "shaft_stroke_style": "rgba(192, 192, 192, 0.5)",
        "meter_fill_style": "rgba(255, 255, 255, 0.0)",
        "meter_stroke_style": "rgba(192, 240, 255, 0.2)",
        "param_fill_style": "rgba(128, 240, 192, 0.5)",
        "param_stroke_style": "rgba(128, 224, 176, 0.8)",
        "text_fill_style": "rgba(128, 128, 255, 0.1)",
        "text_stroke_style": "rgba(128, 224, 176, 0.8)",

        object_basis: null,

        canvas_context: null,

        parameters: null,
        parameter_texts: null,
        parameter_relations: null,
        parameter_text_params: null,

        max_radius: 0,

        // メソッド共有変数
        shaft_surfaces: null,
        meter_surfaces: null,
        param_surfaces: null
    }

    constructor(operator_basis) {
        this.operator_basis = operator_basis;
    }

    setCanvasContext(canvas_context) {
        this.property.canvas_context = canvas_context;
    }

    /**
     * 実体化
     *
     * @param   string  embody_key
     * @param   object  params
     */
    summons(embody_key, params?: {}): Object | void {
        try {
            // 実体化
            const embody = {
                basis: this,
                object_basis: this.operator_basis.summons(embody_key, this.property.canvas_context, params)
            };

            // プロパティ定義
            for (let i in this.property) {
                if (embody[i] === undefined) {
                    embody[i] = this.property[i];
                }
            }
            for (let i in params) {
                if (embody[i] !== undefined) {
                    embody[i] = params[i];
                }
            }

            // 内部変数の初期化
            if (embody.parameter_texts === null) {
                throw 'Undefined param(parameter_texts).';
            }
            if (embody.parameters === null) {
                embody.parameters = new Array();
            }
            embody.parameter_relations = new Array();
            embody.shaft_surfaces = {};
            embody.meter_surfaces = {};
            embody.param_surfaces = {};
            embody.parameter_text_params = {};

            // 共通メソッド定義
            const ref = this;
            if (embody.configureParam === undefined) {
                embody.configureParam = function (parameters) {
                    ref.configureParam(this, parameters);
                };
            }
            if (embody.setDirection === undefined) {
                embody.setDirection = function (rotate_theta, vector_theta, length_theta) {
                    ref.setDirection(this, rotate_theta, vector_theta, length_theta);
                };
            }
            if (embody.output === undefined) {
                embody.output = function () {
                    ref.output(this);
                };
            }

            embody.object_basis.canvas_context.font = '12px';
            //embody.object_basis.canvas_context.font = "12px 'osaka,sans-serif'";

            // 初期化
            this.configure(embody);

            return embody;
        } catch (e) {
            alert(e);
        }
    }

    /**
     * 初期化
     *
     * @param   object  embody
     */
    configure(embody): void {
        embody.object_basis.configure();

        for (let i in embody.object_basis.reles) {
            embody.parameter_relations.push(i);

            embody.shaft_surfaces[i] = ['O', i];

            if (embody.object_basis.reles[i].R > embody.max_radius) {
                embody.max_radius = embody.object_basis.reles[i].R;
            }
        }

        if (embody.parameters.length === 0) {
            embody.parameter_relations.forEach(() => {
                embody.parameters.push(0);
            });
        }
        if (embody.parameter_relations.length !== embody.parameters.length) {
            throw 'Invalid parameter length(request: ' + embody.parameters.length + ', capacity: ' + embody.parameter_relations.length + ').';
        }
        if (embody.parameter_relations.length !== embody.parameter_texts.length) {
            throw 'Invalid parameter length(request: ' + embody.parameter_texts.length + ', capacity: ' + embody.parameter_relations.length + ').';
        }

        for (let j in embody.object_basis.surfaces) {
            embody.param_surfaces[j] = new Array();

            embody.object_basis.surfaces[j].forEach((surface) => {
                embody.param_surfaces[j].push(`${surface}_param`);
            });
        }

        if (embody.parameters.length !== 0) {
            this.configureParam(embody, embody.parameters);
        }

        const reles_progress = {};

        for (let k in embody.object_basis.reles) {
            for (let l = 1; l <= 3; l++) {
                reles_progress[`${k}_${l}`] = {
                    R: embody.object_basis.reles[k].R * (1 / 4 * l),
                    X: embody.object_basis.reles[k].X,
                    Y: embody.object_basis.reles[k].Y
                };
            }
        }
        for (let m in reles_progress) {
            embody.object_basis.reles[m] = reles_progress[m];
        }

        for (let n in embody.object_basis.surfaces) {
            for (let o = 1; o <= 3; o++) {
                embody.meter_surfaces[`${n}_${o}`] = new Array();

                embody.object_basis.surfaces[n].forEach((surface) => {
                    embody.meter_surfaces[`${n}_${o}`].push(`${surface}_${o}`);
                });
            }
        }

        embody.object_basis.reles['O'] = { R: 0, X: 0, Y: 0 };
    }

    /**
     * パラメーター情報の初期化
     *
     * @param   Object  embody
     * @param   Array   parameters
     */
    configureParam(embody, parameters): void {
        if (parameters.length !== embody.parameter_relations.length) {
            throw 'Invalid parameter length(request: ' + parameters.length + ', capacity: ' + embody.parameter_relations.length + ').';
        }

        for (let i = 0; i < embody.parameter_relations.length; i++) {
            const rel_code = embody.parameter_relations[i];
            const rel_param = embody.object_basis.reles[rel_code];

            const parameter_length = (parameters[i] / 100) * rel_param.R;

            embody.object_basis.reles[rel_code + '_param'] = {
                'R': parameter_length,
                'X': rel_param.X,
                'Y': rel_param.Y
            };

            const text_value = embody.parameter_texts[i] + ': ' + parameters[i];
            const text_param = embody.object_basis.canvas_context.measureText(text_value);

            embody.parameter_text_params[rel_code] = {
                text_value: text_value,
                text_width: text_param.width
            };
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
        const getLengthByPytha = this.operator_basis.geometry_calculator.getLengthByPytha;
        const getLengthesByTheta = this.operator_basis.geometry_calculator.getLengthesByTheta;
        const getThetaByLengthes = this.operator_basis.geometry_calculator.getThetaByLengthes;

        embody.object_basis.moment_surfaces = new Array();

        const surface_group = {
            basis: embody.object_basis.surfaces,
            shaft: embody.shaft_surfaces,
            meter: embody.meter_surfaces,
            param: embody.param_surfaces
        };

        const axis_theta = (vector_theta - (Math.PI / 2));

        for (let part_type in surface_group) {
            const surfaces = surface_group[part_type];
            const reles = embody.object_basis.reles;

            for (let surface_code in surfaces) {
                const surface = surfaces[surface_code];
                let z_index = 0;

                surface.forEach((pos_code) => {
                    const pos_key = part_type + '_' + pos_code;

                    let X = 0;
                    let Y = 0;
                    let Z = 0;

                    if (pos_code !== 'O') {
                        const LS0 = getLengthesByTheta('Z', reles[pos_code].X);
                        const RY0 = LS0.Y;
                        const LZ0 = LS0.X;
                        const TY1 = reles[pos_code].Y + rotate_theta - axis_theta;
                        const LS1 = getLengthesByTheta('Y', TY1);
                        const LX1 = LS1.X * RY0;
                        const LY1 = LS1.Y * RY0;
                        const TX1 = getThetaByLengthes('X', LX1, LZ0);
                        const RX1 = getLengthByPytha(null, LX1, LZ0);
                        const TX2 = TX1 + length_theta;
                        const LS2 = getLengthesByTheta('X', TX2);
                        const LX2 = LS2.X * RX1;
                        const LZ2 = LS2.Y * RX1;
                        const RY2 = getLengthByPytha(null, LX2, LY1);
                        const TY2 = getThetaByLengthes('Y', LX2, LY1);
                        const TY3 = TY2 + axis_theta;
                        const LS3 = getLengthesByTheta('Y', TY3);
                        const LX3 = LS3.X * RY2;
                        const LY3 = LS3.Y * RY2;

                        X = LX3 * reles[pos_code].R;
                        Y = LY3 * reles[pos_code].R;
                        Z = LZ2 * reles[pos_code].R;
                    }

                    embody.object_basis.moment_poses[pos_key] = { X: X, Y: Y, Z: Z };

                    z_index += Z;
                });

                embody.object_basis.moment_surfaces.push({
                    part_type: part_type,
                    code: surface_code,
                    z_index: (z_index / surface.length)
                });
            }
        }

        for (let rel_code in embody.parameter_text_params) {
            const parameter_rel = embody.object_basis.moment_poses['basis_' + rel_code];

            embody.object_basis.moment_surfaces.push({
                part_type: 'text',
                code: rel_code,
                z_index: parameter_rel.Z
            });
        }

        embody.object_basis.moment_surfaces.sort((A, B) => (A.z_index - B.z_index));
    }

    /**
     * 描画
     *
     * @param   object  embody
     */
    output(embody, theta_X, theta_Y, theta_Z): void {
        embody.object_basis.canvas_context.setTransform(1, 0, 0, 1, 0, 0);
        embody.object_basis.canvas_context.clearRect(0, 0, embody.object_basis.size, embody.object_basis.size);

        const surface_group = {
            basis: embody.object_basis.surfaces,
            shaft: embody.shaft_surfaces,
            meter: embody.meter_surfaces,
            param: embody.param_surfaces
        };

        embody.object_basis.moment_surfaces.forEach((moment_surface) => {
            if (moment_surface.part_type === 'text') {
                const parameter_text_param = embody.parameter_text_params[moment_surface.code];
                const parameter_rel = embody.object_basis.moment_poses['basis_' + moment_surface.code];

                const pos_X = parseFloat(parameter_rel.X + embody.object_basis._center + 5);
                const pos_Y = parseFloat(parameter_rel.Y + embody.object_basis._center - 5);

                embody.object_basis.canvas_context.fillStyle = embody.text_fill_style;
                embody.object_basis.canvas_context.fillRect(pos_X - 5, pos_Y - 10, parameter_text_param.text_width + 10, 12);
                embody.object_basis.canvas_context.fillStyle = embody.text_stroke_style;
                embody.object_basis.canvas_context.fillText(parameter_text_param.text_value, pos_X, pos_Y);

                return;
            }

            const target_surface = surface_group[moment_surface.part_type][moment_surface.code];

            embody.object_basis.canvas_context.beginPath();

            target_surface.forEach((pos_code, j) => {
                const pos = embody.object_basis.moment_poses[`${moment_surface.part_type}_${pos_code}`];

                if (j == 0) {
                    embody.object_basis.canvas_context.moveTo(embody.object_basis._center + pos.X, embody.object_basis._center + pos.Y);
                } else {
                    embody.object_basis.canvas_context.lineTo(embody.object_basis._center + pos.X, embody.object_basis._center + pos.Y);
                }
            });

            embody.object_basis.canvas_context.closePath();
            switch (moment_surface.part_type) {
                case 'basis':
                    embody.object_basis.canvas_context.fillStyle = embody.basis_fill_style;
                    embody.object_basis.canvas_context.strokeStyle = embody.basis_stroke_style;
                    break;

                case 'shaft':
                    embody.object_basis.canvas_context.fillStyle = embody.shaft_fill_style;
                    embody.object_basis.canvas_context.strokeStyle = embody.shaft_stroke_style;
                    break;

                case 'meter':
                    embody.object_basis.canvas_context.fillStyle = embody.meter_fill_style;
                    embody.object_basis.canvas_context.strokeStyle = embody.meter_stroke_style;
                    break;

                case 'param':
                    embody.object_basis.canvas_context.fillStyle = embody.param_fill_style;
                    embody.object_basis.canvas_context.strokeStyle = embody.param_stroke_style;
                    break;
            }
            embody.object_basis.canvas_context.fill();
            embody.object_basis.canvas_context.stroke();
        });
    }
}
