new  Vue({
    el: '#app',
    data: {
        title: "スネークゲーム",
        onStatus: "Ready ...",

        grid_size: 10, // 10 x 10 マス
        fruit_index: 0, // フルーツの位置インデックス

        // ヘビに関するデータ
        snake: {
            // 頭の座標（初期値）
            head_pos: {
                x: 1,
                y: 3,
            },
            
            body_indexes: [],  // 体の位置インデックスたち
            direction: '→',  // 進行方向
            speed: 400,  // 1マス進むのにかかる時間[ms] 
        },
    },

    // 初期化
    created() {

        // フルーツの位置をランダムに移動
        this.randomize_fruit_index()

        // キーボード入力のイベントをon_keydownメソッドに投げる
        document.onkeydown = () => {
            this.on_keydown(event.keyCode)
        }

    },

    watch: {

        // フルーツを食べているか監視
        is_eating_fruit(newValue){
            if(!newValue) return  // 食べていなかったら何もしない
            this.grow_up_snake()
            this.randomize_fruit_index()
            this.level_up()
        },

    },

    computed: {
        // ヘビの頭の座標をインデックスに変換
        snake_head_index() {
            if(this.is_frameout) return null
            return this.snake.head_pos.y * this.grid_size + this.snake.head_pos.x
        },

        // フルーツ食べてる？
        is_eating_fruit() {
            return this.snake_head_index === this.fruit_index
        },

        // 自己衝突してる？
        is_suicided(){
            return this.snake.body_indexes.includes(this.snake_head_index)
        },

        // ヘビの頭は画面外？
        is_frameout(){
            const head = this.snake.head_pos
            return head.x < 0 || this.grid_size <= head.x || head.y < 0 || this.grid_size <= head.y
        },

        // ゲームオーバー？
        is_gameover(){
            return this.is_suicided || this.is_frameout
        },
    },

    methods: {

        // 時間を進める
        time_goes(){
            if(this.is_gameover) return
            this.forward_snake()

            // statusを変更
            this.onStatus = "Go !"

            // speedミリ秒後に自分自身を呼び出す
            setTimeout(this.time_goes.bind(this), this.snake.speed)
        },

        // ヘビを進める
        forward_snake() {

            // 体の最後尾を頭に持ってくる
            this.snake.body_indexes.shift()
            this.snake.body_indexes.push(this.snake_head_index)

            // 頭を１マス移動
            switch(this.snake.direction){
                case '←' : this.snake.head_pos.x--; break
                case '↑' : this.snake.head_pos.y--; break
                case '→' : this.snake.head_pos.x++; break
                case '↓' : this.snake.head_pos.y++; break
            }
        },

        // ヘビの体を伸ばす
        grow_up_snake(){
            this.snake.body_indexes.unshift(this.snake.body_indexes[0])
        },

        // フルーツの位置をランダムに移動
        randomize_fruit_index(){
            this.fruit_index = Math.floor(Math.random() * this.grid_size * this.grid_size) // 0~99の乱数
        },

        // キー入力を受け取ってヘビの進行方向を変える（逆方向は不可）
        on_keydown(keyCode){
            switch(keyCode){
                case 37:  // 「←」が押された時
                if (this.snake.direction !== '→') { this.snake.direction = '←'; }
                break

                case 38:  // 「↑」が押された時
                if (this.snake.direction !== '↓') { this.snake.direction = '↑' }
                break

                case 39:  // 「→」が押された時
                if (this.snake.direction !== '←') { this.snake.direction = '→' }
                break

                case 40:  // 「↓」が押された時
                if (this.snake.direction !== '↑') { this.snake.direction = '↓' }
                break
            }
        },

        // 進む時間が短くなる
        level_up(){
            this.snake.speed -= 10
        }
    },
})
