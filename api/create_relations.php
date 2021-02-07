<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");


function generateRandomUniqueId() {
    /**
     * 
     * Funkcja generująca losowe 24 znakowe unikalne id
     * oparte o mikroczas serwera z prefiksem "i", dodanym
     * dla rozróżnienia między rekordami dodanymi przez
     * interfejs użytkownika a danymi zaimportowanymi 
     * bezpośrednio do bazy.
     * 
     */
    $uid = uniqid("i", true);
    return $uid;
}


function updateManyToMany($conn, $id, $ids_arr, $table_name, $query, $is_updating) {  
    /**
     * 
     * Funkcja wspomagająca skrypty create_item.php oraz
     * update_item.php. Przyjmuje argumenty:
     * $conn        - połączenie z bazą danych,
     * $id          - id obiektu którego relacje będą 
     *                aktualizowane 
     * $ids_arr     - lista id obiektów wchodzących w 
     *                relacje z aktualizowanym obiektem
     * $table_name  - nazwa tabeli przechowywującej
     *                relacje do zaaktualizowania
     * $query       - szablon kwerendy SQL która posłuży
     *                do zapisania relacji to tabeli
     *                o nazwie $table_name
     * $is_updating - zmienna logiczna - jeśli prawdziwa,
     *                funkcja zadziała w trybie edycji
     *                rekordów a nie dodawania rekordów
     * 
     * Funkcja buduje relacje wiele do wielu między
     * obiektem określonym w parametrze $id oraz obiektami
     * określonymi przez wartości przechowywane w parametrze
     * $ids_arr który powinien być listą.
     * 
     */
    
    switch($table_name) {
        case "belongs_to":
            $clear_query = "DELETE FROM belongs_to WHERE belongs_to.album_id = ?"; break;        
        case "recorded_by":            
            $clear_query = "DELETE FROM recorded_by WHERE recorded_by.track_id = ?"; break;
        case "inv_belongs_to":
            $clear_query = "DELETE FROM belongs_to WHERE belongs_to.artist_id = ?"; break;        
        case "inv_recorded_by":            
            $clear_query = "DELETE FROM recorded_by WHERE recorded_by.artist_id = ?"; break;            
        default:             
            http_response_code(400);
    }

    $clearRelationStmt = mysqli_prepare($conn, $clear_query);    
    mysqli_stmt_bind_param($clearRelationStmt, "s", $id);  

    if (!empty($ids_arr)) {                
        mysqli_stmt_execute($clearRelationStmt);        
        $updateRelationStmt = mysqli_prepare($conn, $query);

        foreach ($ids_arr as $related_id) {            
            mysqli_stmt_bind_param($updateRelationStmt, "ss", $id, $related_id);
            $_result = mysqli_stmt_execute($updateRelationStmt);            
        }       

        if (!$is_updating) {             
            if (mysqli_stmt_affected_rows($updateRelationStmt) <= 0) {                
                http_response_code(400);
            } else {
                http_response_code(201);
            }
        } else {
            if (!$_result) {
                http_response_code(400);
            } else {
                http_response_code(200);
            }            
        }        
    } else {
        if ($is_updating) {
            $clear_result = mysqli_stmt_execute($clearRelationStmt);    
            if (!$clear_result) {
                http_response_code(400);
            } else {
                http_response_code(200);
            }
        }
    }    
}  


function updateOneToMany($conn, $id, $ids_arr, $is_updating) {
    /**
     * 
     * Funkcja wspomagająca skrypty create_item.php oraz
     * update_item.php. Przyjmuje argumenty:
     * $conn        - połączenie z bazą danych,
     * $id          - id obiektu którego relacje będą 
     *                aktualizowane 
     * $ids_arr     - lista id obiektów wchodzących w 
     *                relacje z aktualizowanym obiektem
     * $is_updating - zmienna logiczna - jeśli prawdziwa,
     *                funkcja zadziała w trybie edycji
     *                rekordów a nie dodawania rekordów
     * 
     * Funkcja buduje relacje jeden do wielu między
     * obiektem określonym w parametrze $id oraz obiektami
     * określonymi przez wartości przechowywane w parametrze
     * $ids_arr który powinien być listą. Robiąc to, funkcja
     * najpierw sprawdza, czy obiekty określone przez id 
     * z parametru $ids_arr nie mają już relacji, które 
     * uniemożliwiły by połączenie ich ze wspomnianym 
     * wcześniej obiektem.
     * 
     */    

    $chk_query = "SELECT songs.id FROM songs WHERE songs.id = ?, songs.album_id IS NULL";
    $clear_query = "UPDATE songs SET songs.album_id = NULL WHERE songs.album_id = ?";
    
    $checkStatement = mysqli_prepare($conn, $chk_query);
    $clearStatement = mysqli_prepare($conn, $clear_query);
    mysqli_stmt_bind_param($clearStatement, "s", $id);
    
    if (!empty($ids_arr)) {  
        foreach ($ids_arr as $related_id) {            
            mysqli_stmt_bind_param($checkStatement, "s", $related_id);
            mysqli_stmt_execute($checkStatement);
            if (mysqli_stmt_num_rows($checkStatement) > 0) {
                http_response_code(400);
            }
        }

        $query = "UPDATE songs SET songs.album_id = ? WHERE songs.id = ?";
        $updateStatement = mysqli_prepare($conn, $query);
        
        mysqli_stmt_execute($clearStatement);        
        foreach ($ids_arr as $related_id) {
            mysqli_stmt_bind_param($updateStatement, "ss", $id, $related_id);
            $update_result = mysqli_stmt_execute($updateStatement);
            if (!$update_result) {
                http_response_code(400);
            }            
        }
    } else {
        if ($is_updating) {
            $clear_result = mysqli_stmt_execute($clearStatement);
            if (!$clear_result) {
                http_response_code(400);
            } else {
                http_response_code(200);
            }
        } else {
            http_response_code(201);   
        }        
    }
}