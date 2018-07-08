環境構築履歴
( https://qiita.com/luckypool/items/f1e756e9d3e9786ad9ea )
(  https://qiita.com/SatouRyou/items/6169800993587f4e6018 )
( https://qiita.com/Quramy/items/a5d8967cdbd1b8575130 )
( http://js.studio-kingdom.com/typescript/handbook/module_resolution )
( http://koukitips.net/post1967/ )
git clone https://github.com/riywo/anyenv ~/.anyenv
vi ~/.zshrc
+if [ -d $HOME/.anyenv ] ; then
+	export PATH="$HOME/.anyenv/bin:$PATH"
+	eval "$(anyenv init -)"
+fi
source ~/.zshrc
anyenv install ndenv
mkdir radar
cd radar/
yarn init
yarn add typescript
yarn add react
yarn add react-dom
yarn add redux react-redux
yarn add webpack --dev
yarn add webpack-dev-server --dev
yarn add babel-loader babel-core --dev
yarn add babel-preset-react --dev
yarn add babel-preset-es2015 --dev
yarn add babel-preset-stage-0
yarn add lint
yarn add extract-text-webpack-plugin@next node-sass style-loader css-loader sass-loader
yarn add typed-css-modules typed-css-modules-loader
yarn add postcss-loader
vi webpack.config.js

yarn run build --mode=development
yarn webpack-dev-server --mode=development
