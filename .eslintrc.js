// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  parserOptions: {
    sourceType: 'module',
    'ecmaVersion': 7
  },
  env: {
    browser: true,
    'es6': true
  },
  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  extends: ['plugin:vue/essential', 'airbnb-base'],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  rules: {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      js: 'never',
      vue: 'never'
    }],
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state', // for vuex state
        'acc', // for reduce accumulators
        'e' // for e.returnvalue
      ]
    }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      optionalDependencies: ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 取消换行符限制, 允许(\n\r)
    "linebreak-style": 0,
    // 单行最大宽度140字符
    "max-len": [2, { "code": 140, "ignoreTrailingComments": true }],
    // 允许使用console
    "no-console": [1, { "allow": ["warn", "error"] }],
    // 仅允许数学运算, 逻辑运算可以混合
    "no-mixed-operators": [
      2,
      {
        "groups": [
          // ["+", "-", "*", "/", "%", "**"],
          ["&", "|", "^", "~", "<<", ">>", ">>>"],
          // ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
          // ["&&", "||"],
          ["in", "instanceof"]
        ],
        "allowSamePrecedence": true,
      }
    ],
    // 三元运算符嵌套仅报警告
    "no-nested-ternary": 1,
    // 对参数重新赋值仅报警告
    "no-param-reassign": 1,
    // 禁止使用(++, --)，仅允许循环语句中使用
    "no-plusplus": [2, { "allowForLoopAfterthoughts": true }],
    // 允许空行的空格
    "no-trailing-spaces": [2, { "skipBlankLines": true }],
    // 允许三元运算，允许a && a()
    "no-unused-expressions": [
      2,
      { "allowShortCircuit": true, "allowTernary": true }
    ],
    // 关闭class method必须使用this
    "class-methods-use-this": 0,
    // allow async-await
    'generator-star-spacing': 'off',
    'semi': ["error", "always"],
    'quotes': [ 'error', 'single' ],
    "arrow-parens": 0,
    "function-paren-newline": 0,
    "comma-dangle": [
      2,
      "only-multiline"
    ],
    "indent":[0,14],
  }
}
